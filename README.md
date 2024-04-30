# Parse & Formatting Input Tools

Extract numbers from an input text.

```js
number("Hi there I want 3 of them"); // 3
number("I do need 2, not actually 6"); // 2
number("H2ey, 6 325 please"); // 6325
number("3,456 o maybe 2.456"); // 3.456
number("3.456 o maybe 2,456"); // 3.456
number("I have 53 245 583 395 1 tokens"); // 53245583395.1
number("Do you have 1.000.000,34"); // 1000000.34
number("Do you have 1,000,000.34"); // 1000000.34
```

Extract options from an input text.

```js
option("I want to choose the a option", ["a", "b", "c"]); // a
option("no a, i need the B", ["a", "b", "c"]); // b
option("Go to the option 10 sir", [1, 10, 100]); // 10
```

Time stamp format

```js
timestamp(3456) // 3s456ms
timestamp(1000000) // 16m40s
timestamp(31556736000) // 1y
```
