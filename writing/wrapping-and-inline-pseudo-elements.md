---
title: Text Wrapping & Inline Pseudo Elements
date: 2019-02-07
excerpt: An overview of the best way to put an icon next to copy, while preventing it wrapping onto the next line.
layout: layouts/post.njk
headerImage: wrapping-and-inline-pseudo-elements-header.svg
tags:
  - writing
---

A really common pattern on the web is adding an icon or indicator using a pseudo element so it appears before or after an element, such as an external link indicator:

{% img 'awkward-wrapping.jpg', 'Text not wrapping correctly', 'intro-sm', 'intro-lg' %}

While you could accomplish this by adding an inline SVG, in this instance it's far cleaner to just use a pseudo element and keep it within the domain of the stylesheet since:

- You don't have to change the markup, which is especially important if you're using a CMS. The last thing you want to be doing is [parsing HTML with regex](https://stackoverflow.com/questions/1732348/regex-match-open-tags-except-xhtml-self-contained-tags/1732454#1732454).
- There's no duplication of the SVG, which is preferable since it will occur (potentially) many times per-page.

That leaves us with adding a background-image to a pseudo element.

## The problem

My first instinct was to make the element `inline-block`:

```scss
a[href*="//"]:not([href*="jayfreestone.com"]) {
  &:after {
    content: '';
    display: inline-block;
    width: 1em;
    height: 1em;
    background-image: url('external.svg');
  }
}
```

However this doesn't guarantee the icon will appear on the same line as the rest of the text, creating awkward looking breaks:

<Image 
  width={1280}
  height={416}
  src={exampleImageMd}
  srcset={`${exampleImageMd} 640w, ${exampleImageLg} 1280w`}
  sizes="calc(100vw - (2 * var(--s-h-pad))), (min-width: 40em) 40em"
  alt="A screenshot showing how the icon falls to the next line by itself."
/>

Adding `white-space: nowrap;` to the link works, but results in the *entire* link not wrapping, creating its own set of awkward breaks and greatly increasing the chance of overflow.

## Editing the markup

The easiest solution is to wrap the final word and add the `::after` to that:

```html
<a href="http://test.local">This is a <span>link</span></a>
```

```scss
a[href*="//"]:not([href*="jayfreestone.com"]) > span {
  white-space: nowrap;

  &:after {
    /*...*/
  }
}
```

However the second we end up modifying the markup, we're in the exact situation we were trying to avoid. If we were going down this route we'd probably want to just move the logic for external links into the template:

```html
<!-- Needs conditional logic which only wraps the word if the link is external. -->
<a href="http://test.local">This is a <span class="with-icon with-icon--external">link</span></a>
```

This would at least be more robust and explicit than the previous option, however we've gone all-in on modifying the markup.

## Using padding & margins

One option is to keep the HTML as-is and use padding and negative margins to prevent wrapping:

```html
<a href="http://test.local">This is a link</a>
```

```scss
a[href*="//"]:not([href*="jayfreestone.com"]) {
  --icon-offset: 2em;
  padding-right: var(--icon-offset);

  &,
  &:after {
    display: inline-block;
  }

  &:after {
    /*...*/
    margin-left: calc(var(--icon-offset) * -1);
  }
}
```

At first glance this works great, but it falls victim to the same issue as the `nowrap` solution: making the link `inline-block` will prevent it wrapping correctly. The text *inside it* will wrap, but not alongside the text *outside* of it:

<Image 
  width={1280}
  height={416}
  src={awkwardWrappingImageMd}
  srcset={`${awkwardWrappingImageMd} 640w, ${awkwardWrappingImageLg} 1280w`}
  sizes="calc(100vw - (2 * var(--s-h-pad))), (min-width: 40em) 40em"
  alt="A screenshot showing how the link now doesn't break cleanly, instead falling to a new line."
/>

## Keeping it inline 

If we don't need to explicitly size `height` of the `::after`, we can avoid `inline-block` entirely:

```scss
a[href*="//"]:not([href*="jayfreestone.com"]) {
  &:after {
    content: '';
    background-image: url('external.svg');
  }
}
```

By default the element's display will be `inline`, which makes it a text-binding element. As long as there is no space in the markup between the final word and the closing tag, the `::after` will be evaluated as *part of the previous word*:

```html
<!-- This is (kind of) how the browser sees the inline after: -->
<a href="http://test.local">An external link<after /></a>
```

Therefore this works great:

```html
<a href="http://test.local">Test</a>
```

And this doesn't, since there are additional text nodes (spaces) created between the opening and closing tags:

```html
<a href="http://test.local">
  Test
</a>
```

This is the same problem that has plagued `inline-block` grid usage: indentation and spaces in the markup are evaluated as text-nodes on non-block-level elements. 

It's also the same reason [Prettier's](https://prettier.io/) HTML formatting is actually the [correct behaviour](https://twitter.com/svinkle/status/1070327883397283840), despite being ugly:

```html
<a
  href="http://test.local"
  ><span
    >Test</span
  ></a
>
```

Given I didn't need the flexibility of `inline-block`, I went for the latter option of simply leaving the element `inline`, meaning it's always attached to the final word, and applied sizing with padding instead:

```scss
a[href*="//"]:not([href*="jayfreestone.com"]) {
  &:after {
    content: '';
    margin-left: var(--s-1);
    padding-left: 1em;
    // I used a mask instead of a background-image, 
    // but the same principal applies.
    background-color: var(--t-link-color);
    mask-image: url('...');
    mask-size: 1em;
    mask-position: center;
    mask-repeat: no-repeat;
  }
}
```

## The Takeaways 🍕

- Don't use `inline-block` in long-form, since it won't wrap elegantly.
- Don't forget that adding whitespace inside `inline` elements actually creates text nodes, changing the behaviour and appearance of the content.
- Pseudo elements are treated as immediately preceding/following their sibling text-nodes, so they'll be treated as part of the word they're touching.

You can find a [playground with all of the above examples on CodePen](https://codepen.io/jayfreestone/pen/jdYENK).