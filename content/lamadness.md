+++
draft = false
date = 2021-12-08
title = "Lamadness: CPU Implementation Part1"
description = "Custom NES emulator written in Rust"

[taxonomies]
tags = ["emulation"]
categories = []
+++

I always wanted to write an emulator. For some reasons, it seemed like magic to me,
and something I could never do. I tried to write a CHIP-8 emulator, and a spark
happened in me : I wanted more.

<!-- more -->

**Note:** This article is not complete. It is still being written and \
the project is not yet finished

## Introduction

I started to gather info on how I could emulate this console, and i found pretty
good resources like the 6502's manual with all the specifications of the NES's CPU.

I also followed a bit of [bugzmanov's tutorial](https://bugzmanov.github.io/nes_ebook) (itself written in rust) but I felt
like some of his code was not how I imagined it. One of the only thing that comes
straight from this tutorial is the iNES file parser, but I am feeling like I want
to make my own, and be able to parse iNES2.0

So I started by emulating the CPU. I had to implement all the the instruction set.

For this task, I used many resources :

- [A site regrouping the opcode matrix and all the commands](http://www.oxyron.de/html/opcodes02.html)
- [A pdf about the 6502's chip family](http://archive.6502.org/datasheets/rockwell_r650x_r651x.pdf)
- [Nesdev Wiki](http://wiki.nesdev.com/w/index.php/Nesdev_Wiki)
- [This site for all instructions that were not clear to implement](http://www.obelisk.me.uk/6502/reference.html)

The 6502 doesn't have a lot of instructions *per se* with its 56 instructions
(as far as i know, x86 have more than 400 mnemonics) but it still is a whole lot of text to type.
With all the addressing modes and the illegal operations, it steps up to 256 operations to handle.
Instead, I extracted all the informations needed in a CSV file, enumerating all the instructions,
their addressing modes and their execution cycles.
Then i parsed this file and generated every instructions bodies, and a list
mapping every opcode to the correct addressing mode and function.

An item in my instruction list looks like this :

```rust
Instruction { //00
    name: "BRK",
    addr_mode: AddressingMode::Implied,
    command: CPU::brk,
    cycles: 7,
    page_boundary: false,
}
```

## The addressing modes

The 6502 has 12 addressing modes. An addressing mode tells the cpu where to
look for the data it needs to perform the operations.
I had a pretty hard time grasping the concept, but in the end, it is quite
like learning pointers in C. I implemented the addressing mode by having
a function which return an effective memory address, based on the addressing mode
used. For example `LDA #$01` is the instruction LDA in immediate addressing mode.
In immediate addressing, the byte that comes just after the instruction byte will
be the data used by the instruction. Once assembled `LDA #$01` become `$A9 $01`.
`$A9` is the instruction byte, so the data we're interested to is `$01`.
Because we are executing the instruction `$A9`, this is the data read at
`program_counter`, so the `$01` is stored at `program_counter + 1`