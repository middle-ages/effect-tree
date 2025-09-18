# Draw Module

A simple compositional terminal drawing library that is just good enough to show some recursive structures in diagrams. You use it to build parts, combine them in various ways to build bigger parts, then render them to the terminal.

1. [Overview](#overview)
2. [Parts](#parts)
   1. [Atoms](#atoms)
      1. [Empty](#empty)
      2. [Text](#text)
   2. [Composites](#composites)
      1. [Row](#row)
      2. [Column](#column)
3. [Struts](#struts)
   1. [Drawing Struts](#drawing-struts)
   2. [Overflow](#overflow)
4. [Trees](#trees)

## Overview

Parts can be placed next to each other with a direction and an alignment so that the smaller parts will be stretched and the resulting part will always remain a rectangular area. The library is used for drawing trees here because this placement of parts next to each other can be done with no measuring or computing of sizes.

This is also the main limitation of the library- there is no way to measure part sizes until they are rendered. You cannot render parts while you are computing their content so we use block alignment and the _struts_ feature described below to get around this limitation.

## Parts

You will find here functions to build _parts_, which are rectangular blocks of glyphs. They are rectangular because they will render to a rectangle of text on a terminal. A part never has any holes or jagged edges: every area of the rectangle is filled.  If it has no content it is filled with the space character.

There are four types of the parts, two are atomic and two composite. Atomic parts are the empty part, and a text part for a single row of text. The two types of composites are the _row_ and the _column_. They layout their children horizontally or vertically according to given alignments.  All other parts are built by composing the four parts described above.

Part sizes are defined entirely by their content and padding. When they are aligned, they grow to match the widest or tallest in their row or column, depending on the axis.

The area created when aligning is, together with any explicit padding, the available space that is left for filling with non-content. You can set how this empty area created by the alignment is rendered by setting _struts_ on each of the four directions. Struts have a fixed prefix and suffix but their bodies stretch out to fill available space.

The struts are set by default to empty space, as that is what you usually expect as padding, however we set specific glyphs to draw borders, separators, connectors and other elements where size depends on content.

When your parts are ready, the {@link draw} function will recursively fold the part into a list of string rows for display.

### Atoms

#### Empty

#### Text

### Composites

#### Row

#### Column

## Struts

The glyphs used to fill available space between and around shapes are determined by the {@link Strut}.

By default it is set to the space character, which is usually what  you want surrounding your text when it is being aligned.

The strut can be a character, like the space configured by default, and it will be repeated to fill available space.

However the type for `Strut` also has a _prefix_ and a _suffix_, and its body can be any length, which simplifies some types of drawings described below. For example a horizontal strut is defined as a triplet of:

1. A prefix string.
1. A body string.
1. A suffix string.

the prefix and suffix are optional, and by default they are set to the empty string so that available space fills uniformly with spaces.

### Drawing Struts

A strut is drawn by shapes to fill some available space when aligning and padding. A horizontal strut is N glyphs _wide_ and one glyph _high_. A vertical strut is N glyphs _high_ and zero glyphs _wide_.

A horizontal strut, for example, is drawn so:

1. First we draw the prefix.
1. Next we repeat the body to fill available space leaving space for the
   prefix and suffix.
1. Finally we draw the suffix.

This makes it easy to build parts that stretch to adapt to neighboring parts _without_ measuring or doing any math. For example, leaving a top row of your shape empty, will fill it with a single character of the vertical struct.  This will not take any space, so a horizontal strut will be used to fill the top line. If it is created so:

```ts
const topHorizontalLineStrut = strut.horizontal(
  '├╴╼┅┉┄┈ ',                 // prefix 9 glyphs wide
  ['1', '2', '3', '4', '5'],  // body   5 glyphs wide
  ' ┈┄┉┅╾╌╶┤',                // suffix 9 glyphs wide
)
  ↑    ↑    ↑    ↑
  ┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈ruler
  0123456789012345
```

Note the `body` (the second argument) must be given as a non-empty string array to ensure we always have at least a single glyph with which to fill available space.

Then a line 30 glyphs wide part configured with the `topHorizontalLineStrut` above will be filled so:

```txt
 ├╴╼┅┉┄┈ 1234512345123 ┈┄┉┅╾╌╶┤

↑    ↑    ↑    ↑    ↑    ↑    ↑    ↑
0    5   10   15   20   25   30   35
┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈ruler
012345678901234567890123456789012345
```

A 20 glyphs wide part will be draw so:

```txt
 ├╴╼┅┉┄┈ 123 ┈┄┉┅╾╌╶┤

↑    ↑    ↑    ↑    ↑    ↑    ↑    ↑
0    5   10   15   20   25   30   35
┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈ruler
012345678901234567890123456789012345
```

This is useful, for example when drawing responsive borders, separators, and connectors.

### Overflow

When available space is less than prefix width + a single body width + suffix width, the strut _overflows_. Overflow is cropped by priority.

First we try to remove from the right edge of the _body_ of the strut.

If the entire body was removed but we still overflow, remove in equal measure from the prefix and the suffix, removing from the tail of the prefix and the head of the suffix, so that the last two glyphs remaining are the head glyph of the prefix and the last glyph of the suffix.

If there is only a single space left, the final character of the suffix is clipped so that only the 1st character of the prefix is left.

A 5 glyph wide part will be draw so:

```txt
 ├╴╼┅ ┅╾╌╶┤

↑    ↑    ↑
0    5   10
┈┈┈┈┈┈┈┈┈┈┈ruler
01234567890
```

At a width of 2 glyphs:

```txt
 ├┤

↑    ↑    ↑
0    5   10
┈┈┈┈┈┈┈┈┈┈┈ruler
01234567890
```

And when there is only a single space to fill:

```txt
 ├

↑    ↑    ↑
0    5   10
┈┈┈┈┈┈┈┈┈┈┈ruler
01234567890
```

## Trees

Trees can be _themed_, which just means that they get a theme as an argument and they can use it to theme how they draw. For example a part could depend not on individual _glyphs_, E.g.: `┌` but instead on glyph _roles_, for example the role `elbow`, and then a theme could set the glyph for the role to `╭` to get rounded corners.
