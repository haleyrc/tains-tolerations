---
author: "Ryan Haley"
date: "2016-07-06"
description: "Some notes on array internals in Go"
tags: ["dev"]
title: "IAMADev - Go Arrays"
---

After spending some time looking at how arrays in Go are created and referenced, a
couple things stood out that I wanted to be able to remember in a meaningful way. So
for posterity, a small program demonstrating some potentially confusing behavior:

```go
package main

import (
	"fmt"
)

func main() {
	var v [5]byte
	v2 := append(v[0:0], []byte("hello")...)

	fmt.Println("Addresses of the array structure:")
	fmt.Printf("&v    : %p\n", &v)
	fmt.Printf("&v2   : %p\n", &v2)

	fmt.Println("Addresses of the first element of the backing array:")
	fmt.Printf("&v[0] : %p\n", &v[0])
	fmt.Printf("&v2[0]: %p\n", &v2[0])

	fmt.Println("Updates to the backing array change both:")
	v2[0] = 'y'
	fmt.Println(string(v[:]))
	fmt.Println(string(v2[:]))

	fmt.Println("Appending past the length creates a new backing array:")
	v2 = append(v2, '!')
	fmt.Printf("&v[0] : %p\n", &v[0])
	fmt.Printf("&v2[0]: %p\n", &v2[0])

	fmt.Println("Updates to the new array do not affect the original:")
	v2[4] = 's'
	fmt.Println(string(v[:]))
	fmt.Println(string(v2[:]))
}
```

The thing to note here is that as long as you don't exceed the length of the original
array, the backing array remains the same and changes to it are reflected in the
second pointer as well. As soon as the array expands past that bound, however,
a new backing array is created and the values of the two pointers diverge.