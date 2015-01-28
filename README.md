PureHint
========

Analyses JavaScript code for side-effecting statements.

[Online demo](http://madflame991.github.io/purehint/examples/browser/browser.html)

####Usage

`node purehint.js [option1] [option2] ... <file1> <file2> ...`

Where *option* can be one of:

 + `--allow-var` - ignores *var* declarations. *Const* declarations are preferred to *vars*
 + `--disallow-prototype` - emits errors for assignments to prototypes
 + `--disallow-exports` - emits errors for assignments to the exports object
 + `--disallow-array` - emits errors for every method call that might be an array mutator (*push*, *pop*, *sort*, etc).
 These warnings are disabled by default as they are highly speculative
 + `--stats-only` - suppresses the full log and only counts the number of errors