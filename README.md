PureHint
========

Analyzes JavaScript code for side-effecting statements.

####Usage

`node purehint.js [option1] [option2] ... <file1> <file2> ...`

Where *options* can be one of:

 + `--allow-var` - ignores *var* declarations. *Const* declarations are preferred to *vars*
 + `--disallow-array` - emits errors for every method call that might be an array mutator (*push*, *pop*, *sort*, etc).
 These warnings are disabled by default as they are highly speculative.
 + `--stats-only` - suppresses the full log and only counts the number of errors