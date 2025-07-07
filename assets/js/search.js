---
---
"use strict";

const slugify = (str) => {
  return str
    .toLowerCase()
    .replace(/[\s\.\-]+/g, "-");
}

window.addEventListener("load", () => {
  const search = instantsearch({
    indexName: "interview_questions",
    searchClient: algoliasearch("5QVIJPXEHT", "148f2d0a222861b72fc1b3afed298ecd"),
  });
  const baseUrl = "{{ site.baseurl }}";

  const hitTemplate = (hit) => {
    const url = hit.external_url || hit.url;
    const title = hit._highlightResult.title.value;
    const category = (hit._highlightResult.category || {}.value) || "";
    const tags = (hit._highlightResult.tags || []).map((x) => x.value);
    const content = (hit._highlightResult.content || []).value;

    const defineList = document.createElement("dl");
    defineList.className = "search-list-item";

    const _title = document.createElement("dt");
    _title.className = "search-list-title";

    const titleLink = document.createElement("a");
    titleLink.href = `${baseUrl}${url}`;
    titleLink.innerHTML = title;
    _title.appendChild(titleLink);

    const categorySpan = document.createElement("a");
    categorySpan.className = "search-list-category badge bg-primary";
    categorySpan.href = `${baseUrl}category/${slugify(category)}.html`;
    categorySpan.innerHTML = category;
    _title.appendChild(categorySpan);

    defineList.appendChild(_title);

    const _content = document.createElement("dd");
    _content.className = "search-list-content";
    _content.innerHTML = content;
    defineList.appendChild(_content);

    return defineList.outerHTML;
  };

  search.addWidget(
    instantsearch.widgets.searchBox({
      container: ".search-searchbar",
      placeholder: "请输入关键词",
      cssClasses: {
        form: "input-group",
        input: "form-control",
        submit: "btn btn-primary",
        reset: "btn btn-primary",
      },
      searchAsYouType: false,
    })
  );

  search.addWidget(
    instantsearch.widgets.hits({
      container: ".search-hits",
      templates: {
        item: hitTemplate,
        empty: "无结果",
      },
    })
  );

  search.addWidget(
    instantsearch.widgets.pagination({
      container: ".search-pagination",
      cssClasses: {
        root: "d-flex justify-content-center",
        list: "pagination",
        item: "page-item",
        link: "page-link",
        previousPageItem: "d-none",
        nextPageItem: "d-none",
        selectedItem: "active",
        disabledItem: "disabled",
      },
    })
  );

  search.addWidget(
    instantsearch.widgets.configure({
      hitsPerPage: 10,
    })
  );

  search.addWidget(
    instantsearch.widgets.poweredBy({
      container: ".search-poweredby",
    })
  );

  search.start();

  let submitTimeout;
  const searchBar = document.querySelector(".search-searchbar");

  if (searchBar) {
    searchBar.addEventListener("keyup", (e) => {
      const target = e.target;
      if (!target.classList.contains("ais-SearchBox-input")) {
        return;
      }

      if (submitTimeout) {
        clearTimeout(submitTimeout);
      }

      submitTimeout = setTimeout(() => {
        const submitBtn = document.querySelector(".ais-SearchBox-submit");
        if (submitBtn) {
          submitBtn.click();
        }

        const input = document.querySelector(".ais-SearchBox-input");
        if (input) {
          input.focus();
        }
      }, 500);
    });

    searchBar.addEventListener("keydown", (e) => {
      const target = e.target;
      if (!target.classList.contains("ais-SearchBox-input")) {
        return;
      }

      if (submitTimeout) {
        clearTimeout(submitTimeout);
      }
    });
  }
});
