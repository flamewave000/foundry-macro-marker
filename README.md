<h1 align="center">Macro Marker</h1>
<p align="center">
<img src="https://github.com/janssen-io/foundry-macro-marker/workflows/MacroMarker%20CI/badge.svg" alt="build status" /> <img src="https://img.shields.io/github/downloads-pre/janssen-io/foundry-macro-marker/v1.0.6/macro-marker.zip?label=v1.0.6" alt="v1.0.6 downloads" />
</p>

Using this Foundry VTT module, you can mark macros as active giving them a coloured border and an alternative icon.

Dimming the inactive macros is configurable in the module settings.

> This module is 100% compatible with @Norc's amazing [Custom Hotbar](https://foundryvtt.com/packages/custom-hotbar/)!

### Coloured active macros
<p align="center">
<img src="./img/mm-dim.png" width="500px" />
</p>

---

### Alternative icon and tooltip
<p align="center">
<img src="./img/mm-active-marker-config.png" width="500px" />
</p>
<p align="center">
<img src="./img/mm-tooltip.gif" width="350px" />
</p>

---

### Optional animated border
<p align="center">
<img src="./img/mm-animation.gif" width="350px" />
</p>

---

### Automated toggles
<p align="center">
<img src="./img/mm-marker-config.png" width="500px" />
</p>

<p align="center">
<img src="./img/mm-trigger.gif" width="350px" />
</p>

## Usage
The primary way to use this module, is to set a condition or trigger when the marker is activated. This is done in the macro configuration. This dialog now has an extra tab named "_marker_".

### Trigger-based toggles

The script will execute on any change to the character sheet, when the hotbar renders (e.g. on page changes) and when you select a token.

When the script returns `true`, the marker will be activated. When it returns `false`, it will be deactivated.

Like in the actual macro, you can use the `this` (current macro), `token` (selected token), `actor` (actor of selected token) and `character` (the user's character) variables.

Example:
The following trigger activates the marker when
a) a token is selected; and
b) the strength modifier is less than 0.
```js
if (!token)
  return false;

return actor.data.data.abilities.str.mod < 0;
```

Alternatively, you can return a colour to dynamically colour your marker:
```js
if (!token)
  return false;                   // marker deactivated

const hp = actor.data.data.attributes.hp.value;
const max = actor.data.data.attributes.hp.max;
const ratio = (hp / max) * 100;

if (ratio < 33) return "red";     // active marker with a red colour
if (ratio < 67) return "#FF8000"; // active marker with an yellow colour
return false;                     // marker deactivated
```

If using a trigger like the one above is not an option, you can use flags instead.

### Flag-based toggles
You can toggle the state on one of three entities:

1. Macro
2. Token (or linked actor)
3. User

> **NB:** Flag-based toggles should only be used inside the actual macro, not inside the marker configuratio!


#### Macro
Toggling the state on the macro will make it visible for every user, irregardless of the token they have selected.

```js
MacroMarker.toggle(macro);
```

> **NB: `macro` is a variable pointing to a macro.** In general you can use `this` instead inside your own macros or you can toggle another macro by finding it in `game.macros`. For example `let macro = game.macros.getName('Toggle Rage');`.
> The script macro then becomes this to toggle itself:
> ```js
> MacroMarker.toggle(this);
> ```
> Or this to toggle another macro:
> ```js
> let macro = game.macros.getName('Toggle Rage');
> MacroMarker.toggle(macro);
> ```


#### Token
Toggling the state on the token will make it visible for whoever controls the token. If the token is linked, the state will be synchronized across all other linked tokens of the same actor.

```js
let token = canvas.tokens.controlled[0];
if (token)
  MacroMarker.toggle(macro, { entity: token });
```

#### User
Toggling the state on the user will make it visible for only that user irregardless of the token they have selected.

```js
let user = game.user;
MacroMarker.toggle(macro, { entity: user });
```

### Manual toggles
Alternatively, you can manually activate and deactivate it, using the same function signature as the `toggle`  function.

> **NB:** Manual toggles should only be used inside the actual macro, not inside the marker configuratio!

```js
MacroMarker.activate(macro);
MacroMarker.deactivate(macro);

MacroMarker.activate(macro, { entity: user });
MacroMarker.deactivate(macro, { entity: token });
```

### Checking the state
Finally, you can also check the state:

```js
MacroMarker.isActive(macro);
MacroMarker.isActive(macro, { entity: token });
MacroMarker.isActive(macro, { entity: user });
```

### Marker configuration
You can configure an alternative tooltip, icon and colour when editing the macro.

### More examples
You can find more examples in the included compendium _Macro Marker Examples_.

