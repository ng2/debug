# debug
> A drop-in debug module for AngularJS

## Installation

`component install ng2/debug`

Then require it in your `index.html`:

```
require('ng2-debug');
```

And configure any of the debuggers in your `.config` block.

```
.config( function(DebugEventsProvider) {
  DebugEventsProvider.setVerbosityLevel('vv');
});
```

## Debuggers

At the moment it only has an `event` debugger. All debuggers have disabled output by default.

## Usage

It exposes just one function at the moment: `setVerbosityLevel`.

### setVerbosityLevel ( string )

Sets the verbosity level from `''` (empty string) off, to `'vvv'` (most verbose).