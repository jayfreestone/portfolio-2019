---
title: Access
date: 2014-10-28
layout: layouts/post.njk
excerpt: Good design, UX and otherwise, has always been about improving the content's accessibility. The difference is that in designing a box to fit any object we have failed to design anything at all.
tags:
  - writing
---

[The Web Ahead](http://5by5.tv/webahead/75) recently debated if we’ve neglected aesthetic design for a love affair with UX. I recommend you give it a listen.

The discussion hinges on the apparently homogeneous nature of modern web-design, tted to an overreliance on a [Krugian](http://www.amazon.co.uk/Dont-Make-Me-Think-Usability/dp/0321344758) sense of user experience. Naturally the closer design reaches towards art the stronger the urge becomes to pull back to the quantifiable safety of user testing. The effectiveness of design is often measured through conversions, but design as a whole still retains one foot in the ephemeral. Many carefully constructed and reasoned designs do not achieve what they ought, while others he an undeniable appeal beyond their construction:

<Quote attribution={{ author: 'Paul Rand' }}>
  For the most part, the creation or effects of design, unlike science, are neither measurable nor predictable, nor are the results necessarily repeatable.
</Quote>

It’s tempting, then, to attribute the occasional blandness of the web to an obsession with the quantifiable, but in reality this is merely symptomatic of an increased need for *accessibility*. Accessibility extends beyond [ARIA](http://en.wikipedia.org/wiki/WAI-ARIA) and [WAVE](http://wave.webaim.org). UX design, the CMS, the responsive web movement and every other significant advancement has lowered the bar for digital engagement and creation. Each enables access — *anyone* can view or publish content on *any* device. Responsive design forces us to trade absolutes for approximations while the CMS encourages us to design in modularised templates and building blocks (even truer today thanks to [ACF’s](http://www.advancedcustomfields.com/) Flexible Content Field and [Craft’s](https://buildwithcraft.com/) flexible sections). This fragmentation removes ‘[the potential for heart, individuality, and resonance](http://frankchimero.com/talks/designing-in-the-borderlands/transcript/)’. It’s harder than ever to predict how your design will appear or function, so there is a strong temptation to play it safe. The result is a web which is competent but nearly always compromised. UX didn’t kill aesthetic design, *democratisation did*.

Good design, UX and otherwise, has always been about improving the content's accessibility. The difference is that in designing a box to fit any object we have failed to design anything at all. Websites are more technically accessible than ever, but the content is ironically *less* so — the form now contribues so little value we’ve taken to [stripping it out entirely](http://www.instapaper.com). As Papanek remarks, visual design is not simply about beauty:

<Quote
  attribution={{
    author: 'Victor Papanek, Design for the Real World',
    link: 'http://www.amazon.co.uk/Design-Real-World-Ecology-Social/dp/0500273588',
  }}
>

  Should I design it to be functional…or to be aesthetically pleasing?’ This is
  the most…mixed-up question in design today…aesthetic value is an inherent
  *part* of function.

</Quote>

Visual design is about improving the content's *intellectual accessibility*. It is about improving a message's comprehensibility. There are hundreds of beautiful sites, a handful of wonderfully crafted Snowfalls, but few truly unite form and function, and even fewer are better served in their native habitat.

I am not decrying accessibility or UX design, if anything quite the opposite. We just need to ensure we apply the same consideration to the intellectual accessibility of our content as we do to the technology which delivers it. If design is about merging form and content, then it is about good visual design enabling good UX, not fighting it.

export default ({ children }) => (
  <WritingSingle meta={meta}>{children}</WritingSingle>
);
