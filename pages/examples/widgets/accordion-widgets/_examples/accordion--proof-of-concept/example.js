;(function () {
  var AdgAccordion

  AdgAccordion = class AdgAccordion {
    constructor (el) {
      this.$el = $(el)
      this.initHeadings()
      this.initTogglers()
    }

    initHeadings () {
      return (this.$headings = this.$el.find('[data-adg-accordion-target]'))
    }

    initTogglers () {
      return this.$headings.each(function () {
        var $container, $heading, $toggler, targetId
        $heading = $(this)
        $toggler = $heading
          .wrap("<a href='#' aria-expanded='false'></a>")
          .parent()
        targetId = $heading.attr('data-adg-accordion-target')
        $container = $('#' + targetId)
        $container.hide()
        return $toggler.click(e => {
          $container.toggle()
          $toggler.attr(
            'aria-expanded',
            $toggler.attr('aria-expanded') === 'false' ? 'true' : 'false'
          )
          return e.preventDefault()
        })
      })
    }
  }

  $(document).ready(function () {
    return $('[data-adg-accordion]').each(function () {
      return new AdgAccordion(this)
    })
  })
}.call(this))

// # sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiPGFub255bW91cz4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFNLGVBQU4sTUFBQSxhQUFBO0lBQ0UsV0FBYSxDQUFDLEVBQUQsQ0FBQTtNQUNYLElBQUMsQ0FBQSxHQUFELEdBQU8sQ0FBQSxDQUFFLEVBQUY7TUFFUCxJQUFDLENBQUEsWUFBRCxDQUFBO01BQ0EsSUFBQyxDQUFBLFlBQUQsQ0FBQTtJQUpXOztJQU1iLFlBQWMsQ0FBQSxDQUFBO2FBQ1osSUFBQyxDQUFBLFNBQUQsR0FBYSxJQUFDLENBQUEsR0FBRyxDQUFDLElBQUwsQ0FBVSw2QkFBVjtJQUREOztJQUdkLFlBQWMsQ0FBQSxDQUFBO2FBQ1osSUFBQyxDQUFBLFNBQVMsQ0FBQyxJQUFYLENBQWdCLFFBQUEsQ0FBQSxDQUFBO0FBQ2QsWUFBQSxVQUFBLEVBQUEsUUFBQSxFQUFBLFFBQUEsRUFBQTtRQUFBLFFBQUEsR0FBVyxDQUFBLENBQUUsSUFBRjtRQUVYLFFBQUEsR0FBVyxRQUFRLENBQUMsSUFBVCxDQUFjLHdDQUFkLENBQXVELENBQUMsTUFBeEQsQ0FBQTtRQUVYLFFBQUEsR0FBVyxRQUFRLENBQUMsSUFBVCxDQUFjLDJCQUFkO1FBQ1gsVUFBQSxHQUFhLENBQUEsQ0FBRSxHQUFBLEdBQU0sUUFBUjtRQUNiLFVBQVUsQ0FBQyxJQUFYLENBQUE7ZUFFQSxRQUFRLENBQUMsS0FBVCxDQUFlLENBQUMsQ0FBRCxDQUFBLEdBQUE7VUFDYixVQUFVLENBQUMsTUFBWCxDQUFBO1VBQ0EsUUFBUSxDQUFDLElBQVQsQ0FBYyxlQUFkLEVBQWtDLFFBQVEsQ0FBQyxJQUFULENBQWMsZUFBZCxDQUFBLEtBQWtDLE9BQXJDLEdBQWtELE1BQWxELEdBQThELE9BQTdGO2lCQUNBLENBQUMsQ0FBQyxjQUFGLENBQUE7UUFIYSxDQUFmO01BVGMsQ0FBaEI7SUFEWTs7RUFWaEI7O0VBeUJBLENBQUEsQ0FBRSxRQUFGLENBQVcsQ0FBQyxLQUFaLENBQWtCLFFBQUEsQ0FBQSxDQUFBO1dBQ2hCLENBQUEsQ0FBRSxzQkFBRixDQUF5QixDQUFDLElBQTFCLENBQStCLFFBQUEsQ0FBQSxDQUFBO2FBQzdCLElBQUksWUFBSixDQUFpQixJQUFqQjtJQUQ2QixDQUEvQjtFQURnQixDQUFsQjtBQXpCQSIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIEFkZ0FjY29yZGlvblxuICBjb25zdHJ1Y3RvcjogKGVsKSAtPlxuICAgIEAkZWwgPSAkKGVsKVxuICBcbiAgICBAaW5pdEhlYWRpbmdzKClcbiAgICBAaW5pdFRvZ2dsZXJzKClcbiAgXG4gIGluaXRIZWFkaW5nczogLT5cbiAgICBAJGhlYWRpbmdzID0gQCRlbC5maW5kKCdbZGF0YS1hZGctYWNjb3JkaW9uLXRhcmdldF0nKVxuICAgIFxuICBpbml0VG9nZ2xlcnM6IC0+XG4gICAgQCRoZWFkaW5ncy5lYWNoIC0+XG4gICAgICAkaGVhZGluZyA9ICQoQClcbiAgICAgIFxuICAgICAgJHRvZ2dsZXIgPSAkaGVhZGluZy53cmFwKFwiPGEgaHJlZj0nIycgYXJpYS1leHBhbmRlZD0nZmFsc2UnPjwvYT5cIikucGFyZW50KClcbiAgICAgIFxuICAgICAgdGFyZ2V0SWQgPSAkaGVhZGluZy5hdHRyKCdkYXRhLWFkZy1hY2NvcmRpb24tdGFyZ2V0JylcbiAgICAgICRjb250YWluZXIgPSAkKCcjJyArIHRhcmdldElkKVxuICAgICAgJGNvbnRhaW5lci5oaWRlKClcbiAgICAgIFxuICAgICAgJHRvZ2dsZXIuY2xpY2sgKGUpID0+XG4gICAgICAgICRjb250YWluZXIudG9nZ2xlKClcbiAgICAgICAgJHRvZ2dsZXIuYXR0cignYXJpYS1leHBhbmRlZCcsIGlmICR0b2dnbGVyLmF0dHIoJ2FyaWEtZXhwYW5kZWQnKSA9PSAnZmFsc2UnIHRoZW4gJ3RydWUnIGVsc2UgJ2ZhbHNlJylcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgXG4kKGRvY3VtZW50KS5yZWFkeSAtPlxuICAkKCdbZGF0YS1hZGctYWNjb3JkaW9uXScpLmVhY2ggLT5cbiAgICBuZXcgQWRnQWNjb3JkaW9uIEAiXX0=
// # sourceURL=coffeescript
