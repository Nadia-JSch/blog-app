---
title: "HTML 4: Accessibility"
date: "2026-02-27"
description: "Essential ARIA attributes"
tags: ["html"]
---


ARIA attributes describe what is happening on web pages in a way that makes the page understandable to people with different abilities. It describes the content and makes it clearer how to use the web page.

In this way, ARIA roles improve the user experience for everyone.

Accessibility checkers: [Common Accessibility Auditing Tools](https://www.freecodecamp.org/learn/responsive-web-design-v9/lecture-importance-of-accessibility-and-good-html-structure/what-are-some-common-accessibility-auditing-tools)

## Use Semantic HTML

For tables, use the `scope=row` or `scope=col` attribute in a `<th>` element to associate a vertical or horizontal heading with it's line of data.

Use `<label>` and the `for={input id}` element to associate labels with inputs.

## Dynamic UI Elements

"WAI-ARIA (Web Accessibility Initiative - Accessible Rich Internet Application) is a set of guidelines and attributes from W3C that makes dynamic web content and complex web components (sliders, tabs, menus) accessible to people with disabilities." - Google AI Overview

WAI-ARIA is different from WCAG (Web Content Accessibility Guidelines), which are general guidelines instead of the specific WAI-ARIA roles. The POUR initialism describes the WCAG principles of web content to be Perceivable, Operable, Understandable, and Robust.

WAI-ARIA attributes add semantic information to non-semantic, dynamic (rather than static) elements, like `<div>`.

- Use the `role="{something}` attribute to define the element's role for assistive technologies for `<div>` elements.

```html
<div role="button">Click Me!</div>
```

### The `role` attribute

Example:

```html
<div class="alert" id="exp-warning" role="alert">
  <span class="hidden">Your log in session will expire in 3 minutes.</span>
</div>
```

### The `aria-labelledby` attribute

Use the `aria-labelledby="{element id}"` attribute to associate elements acting as labels if you can't use `<label>`. 

Example where screen readers will announce the input as something like "Search, edit":

```html
<input type="text" aria-labelledby="search-btn">
<button type="button" id="search-btn">Search</button>
```

You can have more than one value in the `aria-labelledby` attribute.

```html
<div>
  <span id="volume-label">Volume</span>
  <span id="volume-details">Adjust the volume level</span>
  <input
    type="range"
    min="0"
    max="100"
    value="30"
    aria-labelledby="volume-label volume-details">
</div>
```

Screen readers will read the `volume-label` and `volume-details` elements and announce Volume Adjust the volume level.

Essentially, the `aria-labelledby` attribute tells assistive technologies that the text from another element describes the purpose of the element.

Note that ARIA attributes are non-functional - JavaScript and CSS add functionality and styling.

## Types of ARIA roles

There are six types of ARIA role categories.

### The `aria-label` attribute

Describes content that isn't normal text (buttons with an icon and math expressions) to screen readers and is an 'invisible label' just for assistive technology. 

Note: `aria-label=` is an attribute used to specify math expressions (probably also generally used for describing content where needed).

Magnifying icon example with the `aria-label=` attribute:

```html
<button aria-label="Search">
  <i class="fa-solid fa-magnifying-glass"></i>
</button>
```

In this case, a screen reader may announce this button as "Search, button".

### 1. Document structure roles

Defines the overall structure of a page but not really used as there are semantic HTML elements which should be used.

But use the roles that don't have a semantic equivalent:

- toolbar
- tooltip
- feed
- math
- presentation
- note
- none

Example of the `role=math` attribute with and 'aria-label` to describe in words what the math is:

```html
<div role="math" aria-label="x squared + y squared = 3">
  x<sup>2</sup> + y<sup>2</sup> = 3
</div>
```

### 2. Widget roles

Widget roles are of interactive elements like scrollbars:

- scrollbar
- searchbox
- separator (when focusable)
- slider
- spinbutton
- switch
- tab
- tabpanel
- treeitem

Searchbox example:

<div class="search-container" role="search">
  <label for="searchbox" class="visually-hidden">Search</label>

<div
  id="searchbox"
  class="searchbox"
  role="searchbox"
  aria-label="Search the site"
  tabindex="0"
  contenteditable="true"
></div>

  <button type="button" aria-label="Submit search">Search</button>
</div>

Some of these widget roles have semantic equivalents which should be used instead.

### 3. Landmark roles

Label key sections of the webpage for screen readers to navigate to, but they do have semantic html equivalents. The roles are not needed if semantic HTML is used:

- banner
- complementary
- contentinfo
- form
- main
- navigation
- region
- search

Semantic HTML equivalents:

- header
- footer
- aside
- form
- main
- nav
- section
- search

Banner example:

```html
<div role="banner" class="site-banner">
  <h1>Accessible Web Design</h1>
  <nav>
    <ul>
      <li><a href="#">Home</a></li>
      <li><a href="#">Articles</a></li>
      <li><a href="#">About</a></li>
      <li><a href="#">Contact</a></li>
    </ul>
  </nav>
</div>
```

### 4. Live region roles

Screen readers and assistive technologies announce moving elements to those with visual impairments.

- alert
- log
- marquee
- status
- timer

Example of a status:

```html
<div class="status-demo">
  <button id="update-status-btn">Check Status</button>
  <div id="status-msg" role="status" class="status-message">
    No updates yet.
  </div>
</div>
```

### 5. Window roles

Label sub-windows, like pop-up modal dialogs. But there is a semantic HTML equivalent that should be prioritized: The `<dialog>` element and it's associated JavaScript methods.

The ARIA roles are:

- alertdialog
- dialog

A custom dialog role example:

```html
<button id="open-dialog">Open Dialog</button>

<div
  id="custom-dialog"
  role="dialog"
  aria-modal="true"
  aria-labelledby="dialog-title"
  class="dialog"
>
  <div class="dialog-content">
    <h3 id="dialog-title">Confirm Action</h3>
    <p>Are you sure you want to delete this file?</p>
    <div class="dialog-actions">
      <button id="confirm-btn">Yes</button>
      <button id="close-dialog">Cancel</button>
    </div>
  </div>
</div>
```

### 6. Abstract roles

Abstract roles help organize the document but are used internally by the browser and not developers.

## Comparing `aria-labelledby` and `aria-label`

> "They are often used when the visual label for an element is an image or symbol rather than text. aria-label allows you to define the name directly in the attribute while aria-labelledby allows you to reference existing text on the page."

Both attributes describe the functionality of an element for screen readers and assistive technologies. 

There are more advantages to using the visible `aria-labelledby` attribute, so use it when there is existing visible text on the webpage:

- aria-label doesn't get translated for translation services
- you can reference multiple elements with `aria-labelledby`
- updating the text of the label element also updates the label

Don't use both aria-labelledby and aria-label for the same element, as the aria-label will be ignored. 

## The `aria-hidden=true` attribute

The aria-hidden attribute should be used sparingly in cases to hide a decorative element or duplicate content from assistive technologies. 

For example, hide a Font Awesome icon by setting it to `aria-hidden="true"`:

```html
<button>
  <i class="fa-solid fa-gear" aria-hidden="true"></i>
  <span class="label">Settings</span>
</button>
```

Note that `aria-hidden` makes the child elements hidden from the accessibility tree (there's an accessibility tree) as well. 

Hiding an element this way hides it from the accessibility tree  and not the DOM itself. 

Don't use `aria-hidden` on elements that are focusable using the keyboard otherwise you can get the situation where a screen reader effectively focuses on nothing. 

## The `aria-describedby` attribute

Use the `aria-describedby` attribute for form instructions and error messages. Set the value of `aria-describedby` to the `id` of the element containing the info or error feedback:

```html
<button aria-describedby="delete-message">Delete</button>

<p id="delete-message">Warning! All deletions are permanent.</p>
```

Not all screen readers will announce the linked text in the same way but it's still a good idea to add it. 

>"aria-describedby attribute: Used to provide additional information about an element by associating it with another element that contains the information. This gives people using screen readers immediate access to the additional information when they navigate to the element. Common usage would include associating formatting instructions to a text input or an error message to an input after an invalid form submission."

## Image Alt text

The `alt` description is important for search engines, missing images, and to describe images to people with visual impairments.

It's not necessary to describe purely decorative images. In this case, leave the alt text blank so screen readers don't read the file name instead (which is a behavior they sometimes do). 

```html
<img src="resort.png" alt="Tropical resort featuring a swimming pool surrounded by palm trees and bungalows." />
```

Notes:

- Don't start with "Image of a..."
- End with a period
- Keep the description short but descriptive of the image in context to its purpose. 
- Don't repeat text already on the page
- If the image is a link to another page, the alt text should say "Go to the X page":

```html
<a href="about.html">
  <img src="arrow-right.png" alt="Go to next page." />
</a>
```

## Link text

Descriptive link text makes it clear to everyone what they'll be getting by clicking on a link. It's good for accessibility and people skimming the page in a non-linear way. 

- Avoid "click here", "more info", "details", "read more" type labels. 
- Use descriptive link text that describes the destination and not action. 

Example of descriptive link text:

```html
<a href="webinar-details-link">
  Get details about our upcoming webinar
</a>
```

## Text for Audio and Video 

Text accompanying audio and video means the content can reach a wider audience including people who are in quiet or noisy environments and those with hearing disabilities.

There are three kinds of accompanying text to audio and video:

- Captions describe sounds as well as spoken language. 
- Subtitles are for just text, and essential if the spoken language differs from the viewers
- Transcripts are the entire written content of what was spoken, isn't synced, it can be searched, and is useful for deaf people who don't need synced captions.

Add the files to the `<audio>` or `<video>` element with a `<track>` element: 

```html
<!-- video example -->
<video
  width="400"
  height="300"
  controls
  src="https://cdn.freecodecamp.org/curriculum/labs/what-is-the-map-method-and-how-does-it-work.mp4"
>
  <track
    src="captions.vtt"
    kind="captions" # can also be `subtitles`, `chapters`, or `metadata`
    srclang="en"  # the language of the track content
    label="English"   # value displayed on a subtitle selection
  />
</video>

<!-- Audio example -->
<audio controls src="sample.mp3">
  <track
    src="captions.vtt"
    kind="captions"
    srclang="en"
    label="English"
  />
</audio>
```

## Keyboard Accessibility

Many people use the Tab key to move between focusable elements on a webpage or app. Not having a mouse, some disabilities, use of screen reader without a mouse, repetitive strain injury, and preference are some common reasons. 

Avoid setting focusable elements in pop-ups and modal windows where there is nothing else to focus on next or before. 

### The `tabindex` attribute

There is a natural focusable order of which elements are tabbed to next. It is important to never use the tabindex attribute with a value greater than 0. Instead, you should either use a value of 0 or -1.

- `tabindex="0"` is the natural order
- `tabindex="-1"` makes non-focusable elements focusable 
- `tabindex="1"` makes this element focusable first

It't not recommended to change the natural order too much, like in this case where the first element is focusable after the second element:

```html
<input tabindex="2">
<input tabindex="1">
<input tabindex="3">
```

### The `accesskey` attribute

Define which key makes an element focusable, but you need to combine it with other keyboard shortcuts in Window and Mac to activate it. 

For example, `accesskey="s"` assigns the `S `key to the save button:

```html
<button accesskey="s">Save</button>
<a href="index.html" accesskey="h">Home</a>
```

- On a Mac, press the `Option` + `Control key` + `S`
- In Windows, press 'Alt' + 'S'

### Styling focusable elements

Clearly mark the focusable item. 

Use the CSS `outline` property to define a clear border that's high contrast of 3:1 with the border and the background. 

## Resources

- Common Accessibility Tools: Google Lighthouse, Wave, IBM Equal Accessibility Checker, and axe DevTools are some of the common accessibility tools used to audit the accessibility of a website.
- [Accessibility Review](https://www.freecodecamp.org/learn/responsive-web-design-v9/review-html-accessibility/review-html-accessibility)
- [HTML Review](https://www.freecodecamp.org/learn/responsive-web-design-v9/review-html/review-html)
