---
title: Perils of Atomic Design
date: 2015-09-28
excerpt: Modular design methodologies, such as Brad Frost's Atomic Design, offer consistency and maintainability. But do they also foster fragmentation?
layout: layouts/post.njk
tags:
  - writing
---

Modular design methodologies, such as Brad Frost's [Atomic Design](http://atomicdesign.bradfrost.com), offer consistency and maintainability. But do they also foster fragmentation? 

<Quote
  attribution={{
    author: 'Paul Rand Design, Form and Chaos',
    link: 'http://www.amazon.co.uk/Design-Form-Chaos-Paul-Rand/dp/0300055536',
  }}
>

  To design is much more than simply to assemble, to order or even to edit: it
  is to add value and meaning, to illuminate, to simplify, to clarify, to
  modify, to dignify, to dramatize, to persuade, and perhaps even to amuse. To
  design is to transform prose into poetry.

</Quote>

The conceit of Atomic Design, whether you subscribe to the nomenclature or not, is the construction of a system from the inside out. The smallest elements of a design (atoms) are conceived of in isolation, then joined to others continuously (molecules then templates) until the finished design emerges (pages). Such component-based architecture often conflates a ‘living’ style guide with a UI toolkit. Luke Askew summarises the differences:

<Quote
  attribution={{
    author: 'Luke Askew, Fabricator',
    link: 'http://fbrctr.github.io/getting-started/what-is-a-toolkit.html',
  }}
>

  Website style guides have evolved over the years, first starting as an
  outreach of the tradition (print) branding style guides, and eventually
  maturing into interactive examples of how a brand should be look and feel on
  the web… A toolkit is more focused on code - specifically the modularity of
  website interfaces. Toolkits break down websites into small, repeatable
  chunks, then use those chunks to build an infinite number of layouts.

</Quote>

Neither consider the design problem as a whole from the outset, nor are they supposed to. A style guide is the accumulation of decisions and solutions that serve to enforce a cohesive brand. A toolkit, meanwhile, *distances* itself from the brand so as to reinforce its own reusability (although often ironically creating a brand in the process — think [Bootstrap](http://getbootstrap.com)). In a sense, both are the emerging design commodity, but are not instructive of the process that led to their creation. [Style Tiles](http://styletil.es) (essentially mood boards) hit closer in this regard by suggesting approach — not execution. 

## Isolation

The biggest problem with Atomic Design is that it promotes designing in isolation. By focusing in on the final product, be it a style-guide or a toolkit, it attempts to document what has not yet been created. The static comp is often bemoaned as a misrepresentation of how a design will function in practice, but in many ways so are dynamic prototypes of solitary components. Molecules are manufactured, shoehorned, then revised when they fail to pair convincingly as part of a larger system. It is not until work is already complete on them that their appropriateness is assessed:

<Quote
  attribution={{
    author: 'Brad Frost, Atom Design',
    link: 'http://atomicdesign.bradfrost.com',
  }}
>

  Viewing everything in context allows us to loop back to modify our molecules,
  organisms, and templates to better address the real context of the design.

</Quote>

The [TechCrunch](http://techcrunch.com) site, probably the largest scale strictly ‘atomic’ design, encapsulates this. Its components work in a not entirely displeasing fashion, but also not in absolute harmony. There is competition for attention, issues with scale and visible stiches at the seams where each part has been sewn together to form the whole. It is not a ‘bad design’, but it is indicative of the direction of the industry. The whole feels necessarily uninventive, for the interaction between elements must be minified or their re-use invariably threatened.

Even Frost starts to approach the same conclusion:

<Quote>

  But I often feel like many pattern libraries are little more than
  loosely-arranged spray of modules.

</Quote>

## Context

Design is inherently contextual, which is why exhibitions are so challenging to pull off convincingly, why critiques often miss the point, and why architecting modules in ignorance of the collective is foolhardy. Proponents would invariably claim this isn't the case, and that in combining molecules into larger components (such as a header) early and often the process becomes iterative. Yet sites designed around components *look like they have been*. It’s the same illness that plagues designing in the browser.

Stephen Hay is often quoted as saying:

<Quote
  attribution={{
    author: 'Stephen Hay',
    link: 'http://bradfrost.com/blog/mobile/bdconf-stephen-hay-presents-responsive-design-workflow/',
  }}
>
  We’re not designing pages, we’re designing systems of components.
</Quote>

The key here is the systems part. We are not designing the components themselves, we are constructing an ecosystem around them. Designing atoms and molecules in isolation makes this impossible. In any other industry this would be considered absurd, making the industrial design metaphor that is often trotted out even more perplexing:

<Quote
  attribution={{
    author: 'Federico Holgado, Architecting a Pattern Library',
    link: 'http://us5.campaign-archive1.com/?u=7e093c5cf4&id=ead8a72012&e=ecb25a3f93',
  }}
>

  The "door assembler" will gather all these parts—parts that have been
  individually QA'd at their respective facilities—and turn them into a
  completed door. The car manufacturer then takes that QA'd, completed door and
  will bolt it onto the car frame… This process allows the development of these
  components at the same time that other components are being manufactured.

</Quote>

The car is not *designed* in isolation, it is *manufactured* in isolation. The one-thing-well [UNIX philosophy](https://en.wikipedia.org/wiki/Unix_philosophy) does not apply to design systems, which, at their best, operate as a cohesive entity. This is why OS X is a breath of fresh air — it is a UNIX system with a consistent philosophy, a [cathedral, not a bazaar](http://firstmonday.org/ojs/index.php/fm/article/view/1472/1387).

## Independence

Code requires modularity, but that's not to say design doesn't also. Most lasting design systems implement a modular, component-based approach that can be adopted for new situations and collateral. Re-factoring [recurring patterns into libraries](http://amen.tools.bbc.co.uk) affords organisations a level of consistency and maintainability previously unthinkable. However, unlike code, independence is less of a boon:

<Quote
  attribution={{
    author: 'Modularity, W3',
    link: 'http://www.w3.org/DesignIssues/Modularity.html',
  }}
>

  There are lots of reasons for modularity. The basic one is that one module can
  evolve or be replaced without affecting the others. If the interfaces are
  clean, and there are no side effects, then a developer can redesign a module
  without having to deeply understand the neighbouring modules.

</Quote>

Redesigning a module ‘without having to deeply understand the neighbouring modules’ is great for developers, but absolutely detrimental to design. The encapsulation of web-components, BEM-style modular CSS and utility classes are great, but ironically the more modular our sites become, the less relevant they are to the brands they represent.

<Quote
  attribution={{
    author: 'Jesse James Garrett, The Elements of User Experience',
    link: 'http://www.amazon.co.uk/Elements-User-Experience-User-centered-Design/dp/0735712026',
  }}
>

A successful design is not merely a collection of small, well-designed objects;
rather, the objects should form a system that operates as a cohesive, consistent
whole.

</Quote>

It is possible to adopt a middle ground. There are great pattern-library projects out there and [fantastic work](http://styleguides.io/) being done on digital style-guides. Documentation goes a long way to establishing both a basic set of styles and the markup that accompanies them. [KSS](http://warpspire.com/kss/), which has long been the CSS documentation standard, is more than capable of spitting out a basic framework with a minimal amount of upkeep. 

Systems such as Atomic Design attempt to solve an impossible problem in an ever changing landscape. It will be exciting to see how this modular way of thinking will affect the way we build the web, particularly with web components on the horizon — we just need to be careful we don't make the very human problem of design a decidedly mechanical one.
