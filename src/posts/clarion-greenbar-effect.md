---
author: "Ryan Haley"
date: "2016-08-11"
description: "How to get alternating row styles manually"
tags: ["dev"]
title: "IAMADev - Clarion Greenbar Effect"
---

It's fairly common to want alternating styles for rows in a table. Visually it makes long or
information rich datasets easier to deal with while giving it  just a little bit of
pop as well. As with a lot of things in Clarion, getting this effect can be done in one of two ways:
using the built-in tools or manually. If you're already using the BROWSE functionality,
then getting alternating styles is basically a matter of flipping a switch. If, however,
you need a bit more functionality and control and have opted to use a normal list box
and code things up manually, you'll need to do a bit more work to get there.

The process can be broken down in to four steps:

1. Define the styles
2. Add style fields to your QUEUE
3. Enable styles for the list columns
4. Set the style for each row/column

## Define the styles
Before you can tell Clarion to use a particular style, you first have to define what the
possibilities are. This is done by setting the various PROPSTYLE properties of your QUEUE
making sure to also specify the style number since this will be important later. For my
example I just want something simple: alternating white and grey backgrounds.

This is as simple as:

```clarion
DefineGreenbarStyles    ROUTINE
  ?MyQueue{PROPSTYLE:BackColor, 1} = COLOR:White
  ?MyQueue{PROPSTYLE:BackColor, 2} = 0EAEAEAH
```

Now that I have my styles defined, I need somewhere to store them.

## Add style fields
Styles in Clarion list boxes are applied on a cell by cell basis. So for each displayed
field `X`, there needs to be a second (`SHORT`) field `X:Style` immediately following it in the QUEUE.

So, a working QUEUE definition might be:

```clarion
MyQueue     QUEUE,PRE(MYQ)
Name                STRING(30)
Name:Style          SHORT
Description         STRING(100)
Description:Style   SHORT
            END
```

## Enable styles
This step involves setting a flag on the column to let Clarion know that there is a style
field after the field used to populate the column. This can be done by checking the
'Style' option in the 'Listbox format...' window, or by adding the 'Y' flag to all
your columns for hand-coded list boxes.

## Set styles
All that's left now is to actually set the styles on your rows. One thing to keep in
mind is that this step needs to be done after any sorting (and of course redone after any
sort events). The process of doing it is fairly simple, and for our toy example would go
something like this:

```clarion
GreenbarStyle  ROUTINE
DATA
CurrentStyle  SHORT

CODE
  LOOP counter# = 1 TO RECORDS(MyQueue)
    CurrentStyle = (counter# % 2) + 1
    GET(MyQueue, counter#)

    MYQ:Name:Style = CurrentStyle
    MYQ:Description:Style = CurrentStyle
    PUT(MyQueue)
  .
```

It's pretty easy to see what's going on here: the style fields are being set to 1 and
2 alternating which matches up with our style numbers from the first step. Now when the
list displays, we get what we were after.
