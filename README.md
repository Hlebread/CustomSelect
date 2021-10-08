Custom Select
===================

### How to run

- add ```<link rel="stylesheet" href="./CustomSelect.css" />``` to your .html
- add ```<script src="./CustomSelect.js"></script>``` to your .html
- add ```class="ozitag"``` to all ```"select"``` tags you want to make custom
- add ```data-title="<Your title>"``` to all ```"select"``` tags you want to have individual title
- add ```new CustomSelect.init()``` to your .js
- open ```Browser :)```

### Description

This is a module that searches the page for all selects with the specified parameters and replaces them with custom ones. Also, you can independently pass a single select or an array of those as an argument, which needs to be turned into a custom one. Custom selects have the possibility of multiple choice regardless of the "multiple" attribute of the original select, their own title and the ability to respond to the "change" event