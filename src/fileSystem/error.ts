import type {PlatformError, SystemErrorReason} from '@effect/platform/Error'
import {SystemError} from '@effect/platform/Error'
import {Cause} from 'effect'
import type {PathLike} from 'node:fs'

/**
 * @internal
 */
export const handleErrnoException =
  (module: SystemError['module'], method: string) =>
  (
    err: NodeJS.ErrnoException,
    [path]: [path: PathLike | number, ...args: Array<NodeJS.ErrnoException>],
  ): PlatformError => {
    let reason: SystemErrorReason = 'Unknown'

    switch (err.code) {
      case 'ENOENT': {
        reason = 'NotFound'
        break
      }

      /* v8 ignore next 29 */
      case 'EACCES': {
        reason = 'PermissionDenied'
        break
      }

      case 'EEXIST': {
        reason = 'AlreadyExists'
        break
      }

      case 'EISDIR': {
        reason = 'BadResource'
        break
      }

      case 'ENOTDIR': {
        reason = 'BadResource'
        break
      }

      case 'EBUSY': {
        reason = 'Busy'
        break
      }

      case 'ELOOP': {
        reason = 'BadResource'
        break
      }
    }

    return new SystemError({
      reason,
      module,
      method,
      pathOrDescriptor: path as string | number,
      syscall: err.syscall,
      cause: Cause.fail(err.message),
    })
  }
