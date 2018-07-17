---
author: "Ryan Haley"
date: "2016-08-04"
description: "Working with Clarion list boxes"
tags: ["dev"]
title: "IAMADev - Clarion List Boxes"
---

The more I work in Clarion, the more I find myself trying to get away from the
code generation aspect of the language. Changes to generated code are brittle and the
added cost of having to navigate around the fairly clunky interface mean that if I
can spend some extra time learning how to do it by hand, I will almost always lean
that direction.

List boxes at their most basic are fairly "easy" to get added to a window. Create a QUEUE,
add the list box control, open the list box formatter and add the fields, do some formatting
to your liking, and then make sure you set the FROM property to populate the list.

This is all well and good except that I hate creating variables in the IDE, especially
complex types like QUEUEs. Once you've decided to hand-code your QUEUE, you're a bit
out of luck with the list box formatter, since it isn't aware of any types not defined
in the IDE. So now what?

Luckily, you can do all of the steps mentioned above programmatically as well, but as is
true with a lot of Clarion coding, the documentation is a bit thin in some areas and a
bit overblown in others. So for my own benefit, I'm codifying a couple of the tricks that
are generally applicable to simple list box usage here.

## Sorting

A fairly natural requirement for a list box is the ability to sort the list by clicking on
the column header. The process for doing this in Clarion boils down to setting the alert
key for your list box (most likely to MouseLeft), and then in the AlertKey embed for your
LIST, querying some properties to figure out exactly where they clicked.

The first part of this process can be done in the window editor in the properties box
for your control with the generated code for this action being the addition of

```clarion
ALRT(MouseLeft)
```

to your LIST definition. With this done, the AlertKey embed will be available. My code for
this embed looks something like this:

```clarion
CASE KEYCODE()
  OF MouseLeft
    IF ?LIST1{PROPLIST:MouseDownZone} <> LISTZONE:Header
      SELECT(?LIST1, ?LIST1{PROPLIST:MouseDownRow})
    ELSE
      SortListByField(?LIST1{PROPLIST:MouseDownField})
      DISPLAY(?LIST1)
    .
.
```

We have to make sure we check that the click happened within the header first, so that
we can fall back to the default "select a row" behavior if not. Then it's just a matter
of getting the actual header field clicked (these are 1-indexed from left to right) and
in this case, calling a local procedure to do the actual sorting.

From here, it's fairly simple to sort the list. A small example might look like the
following:

```clarion
SortListByField     PROCEDURE(SHORT FieldNum)
FieldName             STRING(20)

CODE
  SortDirection = BXOR(SortDirection, 1)
  
  CASE FieldNum
    OF FIELD:Type
      FieldName = 'Type'
    OF FIELD:Description
      FieldName = 'Description'
  .

  IF SortDirection = SORT:Ascending
    SORT(ProductsQueue, FieldName)
  ELSE
    SORT(ProductsQueue, '-' & FieldName)
  .
  
  RETURN
```

The cases are just making use of some EQUATEs defined in the parent procedure to make
it a bit more readable and easier to add columns in the future should the need arise.

This is obviously a bit spartan, as the sort direction doesn't even reset when a new
column is selected, but it works as a demonstration. Another useful feature would be
addition of some sort of notification about which column is currently the sort field
and in what direction. This can be accomplished by manipulating the PROP:Format property
of the LIST, the syntax of which is described next. But in the tradition of all good
programming examples, the implementation of this is left to the reader.

## Formatting

This section is more of a quick reference, since the various options for the LIST
format string are thoroughly documented in the Clarion help manual. I just find that
in this case, there's a bit more there than I care about for most purposes. So here's
a trimmed down version focusing on what I care about.

The format string itself consists of any number of column format strings appended together.
A sample of a single column might look something like:

```clarion
20L(2)|M~Type~C(0)@s4@
```

The breakdown of this string is the following:

* __20__<br />
	This is the width of the column in screen units. This is distinct from the format
	picture since a picture that ends up wider than the column will have some of itself
	contents hidden.
* __L__<br />
	This is the alignment of the text within the column, specifically this refers to the
	list contents, and not the header. Possible values are L, C, R, and D. The D option
	stands for Decimal alignment with the others being obvious. Be careful using D as
	it can cause some strange alignment issues as it appears to align the decimal point
	at the far right of the column, requiring some indentation. It's probably best to avoid it
	entirely.
* __(2)__<br />
	This is the indentation of the list content, in Clarion's screen units, which are,
	unfortunately, not very intuitive.
* __|__<br />
	Put simply, this adds the vertical bar separator to the right side of the column.
* __M__<br />
	This indicates that the column is resizable at runtime.
* __~Type~__<br />
	The text of the column header.
* __C(0)__<br />
	This mirrors the formatting of the list content but this time for the header text.
* __@s4@__<br />
	The screen picture of the list content. This can be any valid Clarion picture, but
	see the note on column width above.
	
And that's all I generally concern myself with. Obviously if there's a behavior that
you want, consult the documentation, but this is a good start to understanding how to
skip the IDE formatter.