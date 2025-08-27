---
title: A Simulations
permalink: index.html
layout: home
---

The following exercises explore common artificial intelligence workloads in a variety of simulated applications.

There are no setup requirements; all you need is a modern web browser, and you can dive right in to see the kinds of solution that AI enables.

## Exercises

{% assign labs = site.pages | where_exp:"page", "page.url contains '/Instructions/Labs'" %}
{% for activity in labs  %}
<hr>
### [{{ activity.lab.title }}]({{ site.github.url }}{{ activity.url }})

{{activity.lab.description}}

{% endfor %}
