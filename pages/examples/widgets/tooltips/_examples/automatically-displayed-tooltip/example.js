;(function () {
  var AdgTooltipSimple

  AdgTooltipSimple = class AdgTooltipSimple {
    constructor (el) {
      this.$el = $(el)
      this.value = this.$el.attr('data-adg-tooltip-simple')
      this.$el.attr('data-adg-tooltip-simple', null)
      this.initContainer()
      this.attachContentToEl()
      this.initElEvents()
      this.initContainerEvents()
    }

    initContainer () {
      this.$container = $(
        "<span class='adg-tooltip-simple' aria-hidden='true'></span>"
      )
      this.$el.after(this.$container)
      this.initIcon()
      return this.initBalloon()
    }

    initIcon () {
      // Set focusable="false" for IE, see https://stackoverflow.com/questions/18646111/disable-onfocus-event-for-svg-element
      this.$icon = $(
        "<span class='adg-tooltip-simple-icon'><svg class='icon' focusable='false'><use xlink:href='#tooltip' /></svg></span>"
      )
      return this.$container.append(this.$icon)
    }

    initBalloon () {
      this.$balloon = $(
        `<span class='adg-tooltip-simple-balloon' hidden>${this.value}</span>`
      )
      this.$balloon.attr('id', `${this.$el.attr('id')}-balloon`)
      return this.$container.append(this.$balloon)
    }

    attachContentToEl () {
      var valueElement
      valueElement = $(
        `<span class='adg-visually-hidden'> (${this.value})</span>`
      )
      if (this.$el.is('input, textarea, select')) {
        return $(`label[for='${this.$el.attr('id')}'`).append(valueElement)
      } else {
        return this.$el.append(valueElement)
      }
    }

    initElEvents () {
      this.$el.focusin(() => {
        return this.show()
      })
      this.$el.focusout(() => {
        if (!this.$container.is(':hover')) {
          return this.hide()
        }
      })
      this.$el.mouseenter(() => {
        return this.show()
      })
      this.$el.mouseleave(() => {
        if (!this.$el.is(':focus')) {
          return this.hide()
        }
      })
      return this.$el.keyup(e => {
        if (e.keyCode === 27) {
          // Esc
          if (this.$balloon.is(':visible')) {
            return this.hide()
          } else {
            return this.show()
          }
        }
      })
    }

    initContainerEvents () {
      this.$container.mouseenter(() => {
        return this.show()
      })
      return this.$container.mouseleave(() => {
        if (!this.$el.is(':focus')) {
          return this.hide()
        }
      })
    }

    show () {
      return this.$balloon.attr('hidden', false)
    }

    hide () {
      return this.$balloon.attr('hidden', true)
    }
  }

  $(document).ready(function () {
    return $('[data-adg-tooltip-simple]').each(function () {
      return new AdgTooltipSimple(this)
    })
  })
}.call(this))

// # sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiPGFub255bW91cz4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFNLG1CQUFOLE1BQUEsaUJBQUE7SUFDRSxXQUFhLENBQUMsRUFBRCxDQUFBO01BQ1gsSUFBQyxDQUFBLEdBQUQsR0FBTyxDQUFBLENBQUUsRUFBRjtNQUNQLElBQUMsQ0FBQSxLQUFELEdBQVMsSUFBQyxDQUFBLEdBQUcsQ0FBQyxJQUFMLENBQVUseUJBQVY7TUFDVCxJQUFDLENBQUEsR0FBRyxDQUFDLElBQUwsQ0FBVSx5QkFBVixFQUFxQyxJQUFyQztNQUVBLElBQUMsQ0FBQSxhQUFELENBQUE7TUFDQSxJQUFDLENBQUEsaUJBQUQsQ0FBQTtNQUVBLElBQUMsQ0FBQSxZQUFELENBQUE7TUFDQSxJQUFDLENBQUEsbUJBQUQsQ0FBQTtJQVRXOztJQVdiLGFBQWUsQ0FBQSxDQUFBO01BQ2IsSUFBQyxDQUFBLFVBQUQsR0FBYyxDQUFBLENBQUUsNkRBQUY7TUFDZCxJQUFDLENBQUEsR0FBRyxDQUFDLEtBQUwsQ0FBVyxJQUFDLENBQUEsVUFBWjtNQUVBLElBQUMsQ0FBQSxRQUFELENBQUE7YUFDQSxJQUFDLENBQUEsV0FBRCxDQUFBO0lBTGE7O0lBT2YsUUFBVSxDQUFBLENBQUEsRUFBQTs7TUFFUixJQUFDLENBQUEsS0FBRCxHQUFTLENBQUEsQ0FBRSxzSEFBRjthQUNULElBQUMsQ0FBQSxVQUFVLENBQUMsTUFBWixDQUFtQixJQUFDLENBQUEsS0FBcEI7SUFIUTs7SUFLVixXQUFhLENBQUEsQ0FBQTtNQUNYLElBQUMsQ0FBQSxRQUFELEdBQVksQ0FBQSxDQUFFLENBQUEsZ0RBQUEsQ0FBQSxDQUFtRCxJQUFDLENBQUEsS0FBcEQsQ0FBMEQsT0FBMUQsQ0FBRjtNQUNaLElBQUMsQ0FBQSxRQUFRLENBQUMsSUFBVixDQUFlLElBQWYsRUFBcUIsQ0FBQSxDQUFBLENBQUcsSUFBQyxDQUFBLEdBQUcsQ0FBQyxJQUFM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YXNzIEFkZ1Rvb2x0aXBTaW1wbGVcbiAgY29uc3RydWN0b3I6IChlbCkgLT5cbiAgICBAJGVsID0gJChlbClcbiAgICBAdmFsdWUgPSBAJGVsLmF0dHIoJ2RhdGEtYWRnLXRvb2x0aXAtc2ltcGxlJylcbiAgICBAJGVsLmF0dHIoJ2RhdGEtYWRnLXRvb2x0aXAtc2ltcGxlJywgbnVsbClcbiAgXG4gICAgQGluaXRDb250YWluZXIoKVxuICAgIEBhdHRhY2hDb250ZW50VG9FbCgpXG4gICAgXG4gICAgQGluaXRFbEV2ZW50cygpXG4gICAgQGluaXRDb250YWluZXJFdmVudHMoKVxuICAgIFxuICBpbml0Q29udGFpbmVyOiAtPlxuICAgIEAkY29udGFpbmVyID0gJChcIjxzcGFuIGNsYXNzPSdhZGctdG9vbHRpcC1zaW1wbGUnIGFyaWEtaGlkZGVuPSd0cnVlJz48L3NwYW4+XCIpXG4gICAgQCRlbC5hZnRlcihAJGNvbnRhaW5lcilcblxuICAgIEBpbml0SWNvbigpXG4gICAgQGluaXRCYWxsb29uKClcbiAgXG4gIGluaXRJY29uOiAtPlxuICAgICMgU2V0IGZvY3VzYWJsZT1cImZhbHNlXCIgZm9yIElFLCBzZWUgaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMTg2NDYxMTEvZGlzYWJsZS1vbmZvY3VzLWV2ZW50LWZvci1zdmctZWxlbWVudFxuICAgIEAkaWNvbiA9ICQoXCI8c3BhbiBjbGFzcz0nYWRnLXRvb2x0aXAtc2ltcGxlLWljb24nPjxzdmcgY2xhc3M9J2ljb24nIGZvY3VzYWJsZT0nZmFsc2UnPjx1c2UgeGxpbms6aHJlZj0nI3Rvb2x0aXAnIC8+PC9zdmc+PC9zcGFuPlwiKVxuICAgIEAkY29udGFpbmVyLmFwcGVuZChAJGljb24pXG4gICAgXG4gIGluaXRCYWxsb29uOiAtPlxuICAgIEAkYmFsbG9vbiA9ICQoXCI8c3BhbiBjbGFzcz0nYWRnLXRvb2x0aXAtc2ltcGxlLWJhbGxvb24nIGhpZGRlbj4je0B2YWx1ZX08L3NwYW4+XCIpXG4gICAgQCRiYWxsb29uLmF0dHIoJ2lkJywgXCIje0AkZWwuYXR0cignaWQnKX0tYmFsbG9vblwiKVxuICAgIEAkY29udGFpbmVyLmFwcGVuZChAJGJhbGxvb24pXG4gICAgXG4gIGF0dGFjaENvbnRlbnRUb0VsOiAtPlxuICAgIHZhbHVlRWxlbWVudCA9ICQoXCI8c3BhbiBjbGFzcz0nYWRnLXZpc3VhbGx5LWhpZGRlbic+ICgje0B2YWx1ZX0pPC9zcGFuPlwiKVxuICAgIGlmIEAkZWwuaXMoJ2lucHV0LCB0ZXh0YXJlYSwgc2VsZWN0JylcbiAgICAgICQoXCJsYWJlbFtmb3I9JyN7QCRlbC5hdHRyKCdpZCcpfSdcIikuYXBwZW5kKHZhbHVlRWxlbWVudClcbiAgICBlbHNlXG4gICAgICBAJGVsLmFwcGVuZCh2YWx1ZUVsZW1lbnQpXG4gIFxuICBpbml0RWxFdmVudHM6IC0+XG4gICAgQCRlbC5mb2N1c2luID0+IEBzaG93KClcbiAgICBAJGVsLmZvY3Vzb3V0ID0+XG4gICAgICBAaGlkZSgpIHVubGVzcyBAJGNvbnRhaW5lci5pcygnOmhvdmVyJylcbiAgICBcbiAgICBAJGVsLm1vdXNlZW50ZXIgPT4gQHNob3coKVxuICAgIEAkZWwubW91c2VsZWF2ZSA9PlxuICAgICAgQGhpZGUoKSB1bmxlc3MgQCRlbC5pcygnOmZvY3VzJylcbiAgICAgICAgXG4gICAgQCRlbC5rZXl1cCAoZSkgPT5cbiAgICAgIGlmIGUua2V5Q29kZSA9PSAyNyAjIEVzY1xuICAgICAgICBpZiBAJGJhbGxvb24uaXMoJzp2aXNpYmxlJylcbiAgICAgICAgICBAaGlkZSgpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBAc2hvdygpXG4gICAgXG4gIGluaXRDb250YWluZXJFdmVudHM6IC0+XG4gICAgQCRjb250YWluZXIubW91c2VlbnRlciA9PiBAc2hvdygpXG4gICAgQCRjb250YWluZXIubW91c2VsZWF2ZSA9PlxuICAgICAgQGhpZGUoKSB1bmxlc3MgQCRlbC5pcygnOmZvY3VzJylcbiAgICBcbiAgc2hvdzogLT5cbiAgICBAJGJhbGxvb24uYXR0cignaGlkZGVuJywgZmFsc2UpXG4gICAgXG4gIGhpZGU6IC0+XG4gICAgQCRiYWxsb29uLmF0dHIoJ2hpZGRlbicsIHRydWUpXG4gICAgXG4kKGRvY3VtZW50KS5yZWFkeSAtPlxuICAkKCdbZGF0YS1hZGctdG9vbHRpcC1zaW1wbGVdJykuZWFjaCAtPlxuICAgIG5ldyBBZGdUb29sdGlwU2ltcGxlIEAiXX0=
// # sourceURL=coffeescript
