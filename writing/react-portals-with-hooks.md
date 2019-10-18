---
title: React Portals with Hooks
date: 2019-02-20
excerpt: A quick look at implementing a helper for creating Portals using React Hooks.
layout: layouts/post.njk
tags:
  - writing
---

Since [Hooks](https://reactjs.org/docs/hooks-intro.html) have just been introduced into the latest stable build of React, it's a great time to play around with them and think about how previous component structures and paradigms (including classes and HOC's) can fit within them.

Some are easy to reason about, but some are a little less so, such as using ReactDOM's Portal feature:

> Portals provide a first-class way to render children into a DOM node that exists outside the DOM hierarchy of the parent component.
> -- <cite>[React Docs](https://reactjs.org/docs/portals.html)</cite>

The basic idea is that while you component can sit within the React component tree (and benefit from event propagation within it), the actual DOM element will be rendered to a different container on the page. 

> A typical use case for portals is when a parent component has an overflow: hidden or z-index style, but you need the child to visually “break out” of its container. For example, dialogs, hovercards, and tooltips.

## Implementing a portal

To render children to a portal, you simply need to append a container to the DOM on mount and then use ReactDOM's `createPortal` method, passing in the newly created element as the target container:

```javascript
const modalRoot = document.getElementById('modal-root');

class Modal extends React.Component {
  constructor(props) {
    super(props);
    this.el = document.createElement('div');
  }
  componentDidMount() {
    modalRoot.appendChild(this.el);
  }
  componentWillUnmount() {
    modalRoot.removeChild(this.el);
  }
  render() {
    return ReactDOM.createPortal(
      this.props.children,
      this.el,
    );
  }
}
```

When the component mounts this element is then appended to the parent, which is already present in the DOM:

```html
<div id="modal-root"></div>
```

However, what if we wanted to use a functional component and re-implement this with Hooks?

## The one with the Hooks

First of all we establish a reference to our newly created containing element, just like we did in the constructor before:

```javascript
function usePortal(id) {
  const rootElemRef = React.useRef(document.createElement('div'));
}
```

Interesting, it turns out `useRef` is now designed for any instance-based data as opposed to just DOM node references:

> The useRef() Hook isn’t just for DOM refs. The “ref” object is a generic container whose current property is mutable and can hold any value, similar to an instance property on a class.
> -- <cite>[React Docs](https://reactjs.org/docs/hooks-faq.html#is-there-something-like-instance-variables)</cite>

Our hook takes an `id`, which references which parent container it should append itself to (such as 'modal-root' in the original example).

Then we add in `useEffect`, which [takes the place](https://reactjs.org/docs/hooks-effect.html) of the traditional lifecycle in class-based components:

```javascript
function usePortal(id) {
  const rootElemRef = React.useRef(document.createElement('div'));

  useEffect(function setupElement() {
    // Look for existing target dom element to append to
    const parentElem = document.querySelector(`#${id}`);
    // Add the detached element to the parent
    parentElem.appendChild(rootElemRef.current);
    // This function is run on unmount
    return function removeElement() {
      rootElemRef.current.remove();
    };
  }, []);

  return rootElemRef.current;
}
```

We've effectively replaced `componentDidMount` and `componentWillUnmount` with `useEffect`.

At the end we return the node, ready to use within our revised `Modal` component:

```jsx
const Modal = ({ children }) => {
  const target = usePortal('modal');
  return ReactDOM.createPortal(children, target);
};
```

This works great, but instead of our `rootElemRef` being instantiated once when mounted, we're unfortunately recreating it every render by placing it within the function body:

```jsx
// Every render this runs again...
const rootElemRef = React.useRef(document.createElement('div'));
```

It turns out refs should ideally only be set within `useEffect` or by an event handler:

> ...avoid setting refs during rendering — this can lead to surprising behavior. Instead, typically you want to modify refs in event handlers and effects.

To get around this we can take advantage of [lazy initialization](https://reactjs.org/docs/hooks-faq.html#how-to-create-expensive-objects-lazily) to ensure the element is only created once:

```jsx
const rootElemRef = useRef(null);

function getRootElem() {
  if (!rootElemRef.current) {
    rootElemRef.current = document.createElement('div');
  }
  return rootElemRef.current;
}

return getRootElem();
```

This way the component will always return a DOM node, but will not re-create it if `rootElemRef` already points to one.

## Automating parent creation

One thing that's a little annoying is having to manually add the parent 'wrapper' element to the page ahead of time. Provided we don't need to worry about server-rendering the content of the portal, we can do this pretty easily ourselves.

We'll define some helpers up front:

```javascript
/**
 * Creates DOM element to be used as React root.
 * @returns {HTMLElement}
 */
function createRootElement(id) {
  const rootContainer = document.createElement('div');
  rootContainer.setAttribute('id', id);
  return rootContainer;
}
/**
 * Appends element as last child of body.
 * @param {HTMLElement} rootElem 
 */
function addRootElement(rootElem) {
  document.body.insertBefore(
    rootElem,
    document.body.lastElementChild.nextElementSibling,
  );
}
```

These will let us easily add new 'parent' containers for portals if and when we need them. Now we'll modify our `useEffect` callback:

```jsx
useEffect(function setupElement() {
  // Look for existing target dom element to append to
  const existingParent = document.querySelector(`#${id}`);
  // Parent is either a new root or the existing dom element
  const parentElem = existingParent || createRootElement(id);

  // If there is no existing DOM element, add a new one.
  if (!existingParent) {
    addRootElement(parentElem);
  }

  // Add the detached element to the parent
  parentElem.appendChild(rootElemRef.current);

  return function removeElement() {
    rootElemRef.current.remove();
    // If we were the only child, remove the parent container
    if (parentElem.childNodes.length === -1) {
      parentElem.remove();
    }
  };
}, []);
```

Now we have a highly re-usable hook that doesn't rely on us having created the
containing element ahead of time.

## The final code

```jsx
import React, { useRef, useEffect } from 'react';

/**
 * Creates DOM element to be used as React root.
 * @returns {HTMLElement}
 */
function createRootElement(id) {
  const rootContainer = document.createElement('div');
  rootContainer.setAttribute('id', id);
  return rootContainer;
}

/**
 * Appends element as last child of body.
 * @param {HTMLElement} rootElem 
 */
function addRootElement(rootElem) {
  document.body.insertBefore(
    rootElem,
    document.body.lastElementChild.nextElementSibling,
  );
}

/**
 * Hook to create a React Portal.
 * Automatically handles creating and tearing-down the root elements (no SRR
 * makes this trivial), so there is no need to ensure the parent target already
 * exists.
 * @example
 * const target = usePortal(id, [id]);
 * return createPortal(children, target);
 * @param {String} id The id of the target container, e.g 'modal' or 'spotlight'
 * @returns {HTMLElement} The DOM node to use as the Portal target.
 */
function usePortal(id) {
  const rootElemRef = useRef(null);

  useEffect(function setupElement() {
    // Look for existing target dom element to append to
    const existingParent = document.querySelector(`#${id}`);
    // Parent is either a new root or the existing dom element
    const parentElem = existingParent || createRootElement(id);

    // If there is no existing DOM element, add a new one.
    if (!existingParent) {
      addRootElement(parentElem);
    }

    // Add the detached element to the parent
    parentElem.appendChild(rootElemRef.current);

    return function removeElement() {
      rootElemRef.current.remove();
      if (parentElem.childNodes.length === -1) {
        parentElem.remove();
      }
    };
  }, []);

  /**
   * It's important we evaluate this lazily:
   * - We need first render to contain the DOM element, so it shouldn't happen
   *   in useEffect. We would normally put this in the constructor().
   * - We can't do 'const rootElemRef = useRef(document.createElement('div))',
   *   since this will run every single render (that's a lot).
   * - We want the ref to consistently point to the same DOM element and only
   *   ever run once.
   * @link https://reactjs.org/docs/hooks-faq.html#how-to-create-expensive-objects-lazily
   */
  function getRootElem() {
    if (!rootElemRef.current) {
      rootElemRef.current = document.createElement('div');
    }
    return rootElemRef.current;
  }

  return getRootElem();
}

export default usePortal;
```

And usage:

```jsx
import React from 'react';
import { createPortal } from 'react-dom';
import usePortal from './usePortal';

/**
 * @example
 * <Portal>
 *   <p>Thinking with portals</p>
 * </Portal>
 */
const Portal = ({ id, children }) => {
  const target = usePortal(id);
  return createPortal(
    children,
    target,
  );
};

export default Portal;
```
