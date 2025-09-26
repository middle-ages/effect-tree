#!/usr/bin/env perl

use strict;
use warnings;
use feature 'say';

my $file = $ARGV[0];

my $i=0;

open my $fh, '<', $file or die;
$/ = undef;
my $content = <$fh>;
close $fh;

my @parts = split(/^---/m, $content);
my $count = @parts - 1;

(my $base = $file) =~ s/\.ts$//;

for my $part (@parts) {
  if ($i > 0) {
    my $out = "$base.$i.ts";
    print "#      Example #$i/$count...\n";
    $part =~ s/^\n//m;
    $part =~ s/(?:\n|\s)*$//sg;
    open(my $fh, ">", $out) or die "Could not open file $out $!";
    print $fh "$part\n";
    close $fh;
    system("pnpm prettier --write '$out'");
    print "#      Running...\n";
    system("pnpm tsx '$out'");
  }
  $i++;
}
