---
layout: page
title:
permalink: /kinh-nghiem/
exclude_from_search: true
---

<div class="posts">
  {% for post in site.posts %}
  {% if post.tags contains "Tiếng Việt"%}
    <article class="post">

      <h1><a href="{{ site.baseurl }}{{ post.url }}">{{ post.title }}</a></h1>

      <div class="entry">
        {{ post.excerpt }}
      </div>

      <a href="{{ site.baseurl }}{{ post.url }}" class="read-more">Mehr</a>
    </article>
   {% endif %}
  {% endfor %}
</div>