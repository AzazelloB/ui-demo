# UI Principles

This project is a base for a UI library: a small set of composable controls with consistent interaction rules. The demo page is a place to explore and evaluate those rules.

## Choose controls by the values they represent

Start with the user's choice, then choose its representation.

| Kind of choice | Representation |
| --- | --- |
| An action | A button |
| Two states | A toggle |
| A few discrete values | Visible options with direct selection |
| Many discrete values | A select showing the current value and neighboring options, with clicking, dragging, and keyboard navigation |
| A numerical value | A draggable number with direct keyboard editing |
| A text value | A directly editable text input |

“Few” and “many” describe how comfortably the choices can be shown and understood, rather than fixed counts. Numerical values are a separate category because adjusting a quantity differs from choosing a named option.

## Make changes directly

Keep the value and the means of changing it together. Prefer selecting, dragging, or typing directly over opening another surface first.

The select replaces a dropdown: users can see the current choice and adjacent choices, and start changing the value immediately. The number control supports quick adjustment by dragging and precise entry by typing.

Minimize the effort needed to reach a value, not just the number of clicks. A long sequence of steps can be worse than an extra interaction. The current select exposes a local neighborhood, not every option; very large or unordered sets remain a design question.

Text values are edited directly, without separate edit or save controls. Use a visible label to identify the value; a placeholder can suggest what to enter, but does not replace the label.

## Keep only necessary elements

Every control should represent a distinct action or value. Every supporting element should help users understand or perform that interaction.

Prefer one control with complementary ways to interact over separate controls for each method. A number does not need separate increment, decrement, and edit buttons when dragging and typing serve those purposes.

Remove decoration, repeated information, and intermediate steps that do not help the task. Keep labels, feedback, and affordances where they are needed for understanding. Fewer elements should mean less work for the user.

Secondary UI can stay quiet until its context is active. The demo's Contextual UI example explores this through composition, rather than a dedicated component or a requirement for every interface.

## Keep state understandable

Show the current value clearly. Make available choices and changes visible enough to guide the next interaction.

Different controls should share recognizable visual and behavioral conventions. Pointer interactions should have keyboard equivalents and accessible names and state.

## Size controls around their content

Avoid arbitrary fixed or minimum widths. Reserve character-based space where changing glyph widths would cause jitter, and retain tabular numerals for numerical content.

The select reserves space for its longest option. A number grows when its character count grows. Editing begins at the displayed control's width and expands when the entered value needs more space.

## Compose a small library

Build specialized controls from shared underlying elements. Inherit and forward their props rather than recreating their APIs. Define new props only for behavior specific to the specialized control, and explicitly own the event handlers it needs.

Keep values controlled by the caller. Keep temporary interaction state inside the component. Let the page supply application-specific labels, units, and styling.

Add a new component when it represents a different interaction model. Use props and composition for variations within the same model.

## Refine through use

These principles describe the direction of the library, not a finished catalog. Evaluate changes in the demo against the same questions: does this make a value easier to understand, easier to change, or possible to represent with fewer necessary elements?

When a principle makes an interaction harder, revise the design and document the reason.
