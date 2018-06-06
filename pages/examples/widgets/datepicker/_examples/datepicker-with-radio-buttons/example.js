;(function () {
  var AdgDatepicker

  AdgDatepicker = (function () {
    var config

    class AdgDatepicker {
      constructor (el, options = {}) {
        this.$el = $(el)
        this.config = config
        this.currentDate = this.config['date']
        this.initInput()
        this.initOptions()
        this.applyCheckedOptionToInput()
      }

      // Executes the given selector on @$el and returns the element. Makes sure exactly one element exists.
      findOne (selector) {
        var result
        result = this.$el.find(selector)
        switch (result.length) {
          case 0:
            return this.throwMessageAndPrintObjectsToConsole(
              `No object found for ${selector}!`,
              {
                result: result
              }
            )
          case 1:
            return $(result.first())
          default:
            return this.throwMessageAndPrintObjectsToConsole(
              `More than one object found for ${selector}!`,
              {
                result: result
              }
            )
        }
      }

      name () {
        return 'adg-datepicker'
      }

      addAdgDataAttribute ($target, name, value = '') {
        return $target.attr(this.adgDataAttributeName(name), value)
      }

      removeAdgDataAttribute ($target, name) {
        return $target.removeAttr(this.adgDataAttributeName(name))
      }

      adgDataAttributeName (name = null) {
        var result
        result = `data-${this.name()}`
        if (name) {
          result += `-${name}`
        }
        return result
      }

      labelOfInput ($inputs) {
        return $inputs.map((i, input) => {
          var $input, $label, id
          $input = $(input)
          id = $input.attr('id')
          $label = this.findOne(`label[for='${id}']`)[0]
          if ($label.length === 0) {
            $label = $input.closest('label')
            if ($label.length === 0) {
              this.throwMessageAndPrintObjectsToConsole(
                'No corresponding input found for input!',
                {
                  input: $input
                }
              )
            }
          }
          return $label
        })
      }

      show ($el) {
        $el.removeAttr('hidden')
        return $el.show()
      }

      // TODO Would be cool to renounce CSS and solely use the hidden attribute. But jQuery's :visible doesn't seem to work with it!?
      // @throwMessageAndPrintObjectsToConsole("Element is still hidden, although hidden attribute was removed! Make sure there's no CSS like display:none or visibility:hidden left on it!", element: $el) if $el.is(':hidden')
      hide ($el) {
        $el.attr('hidden', '')
        return $el.hide()
      }

      throwMessageAndPrintObjectsToConsole (message, elements = {}) {
        console.log(elements)
        throw message
      }

      text (text, options = {}) {
        var key, value
        text = this.config[`${text}Text`]
        for (key in options) {
          value = options[key]
          text = text.replace(`[${key}]`, value)
        }
        return text
      }

      initInput () {
        this.$input = this.findOne('input[type="text"]')
        this.$input.attr('autocomplete', 'off')
        this.$input.attr('aria-expanded', 'false')
        return this.attachInputEvents()
      }

      initOptions () {
        this.$optionsContainer = this.findOne('fieldset')
        this.addAdgDataAttribute(this.$optionsContainer, 'options')
        this.$optionsContainerLabel = this.findOne('legend')
        this.$optionsContainerLabel.addClass('adg-visually-hidden')
        this.initDate()
        return this.setSelection(this.currentDate.getDate() - 1, false)
      }

      getFirstMonthDay (date) {
        var m, y
        y = date.getFullYear()
        m = date.getMonth()
        return new Date(y, m, 1)
      }

      getLastMonthDay (date) {
        var m, y
        y = date.getFullYear()
        m = date.getMonth()
        return new Date(y, m + 1, 0)
      }

      initDate () {
        var $dateTable,
          $tr,
          day,
          daysOfMonth,
          firstDay,
          i,
          id,
          j,
          k,
          lastDay,
          len,
          len1,
          ref,
          value,
          weekday
        this.$optionsContainer.find('table').remove()
        $dateTable = $(
          `<table border='1'><caption>${
            this.config['monthNames'][this.currentDate.getMonth()]
          } ${this.currentDate.getFullYear()}</caption><thead></thead></table>`
        )
        ref = this.config['dayNames']
        for (j = 0, len = ref.length; j < len; j++) {
          weekday = ref[j]
          $dateTable.find('thead').append(`<th>${weekday}</th>`)
        }
        this.$optionsContainer.append($dateTable)
        firstDay = this.getFirstMonthDay(this.currentDate)
        lastDay = this.getLastMonthDay(this.currentDate)
        daysOfMonth = []
        day = firstDay
        while (day <= lastDay) {
          daysOfMonth.push(new Date(day))
          day.setDate(day.getDate() + 1)
        }

        // Add empty days at beginning
        i = 1
        firstDay = daysOfMonth[0].getDay()
        while (i < firstDay) {
          daysOfMonth.unshift(null)
          i++
        }

        // Add empty days at end
        i = daysOfMonth[daysOfMonth.length - 1].getDay()
        while (i > 0 && i < 6) {
          daysOfMonth.push(null)
          i++
        }
        $tr = null
        for (i = k = 0, len1 = daysOfMonth.length; k < len1; i = ++k) {
          day = daysOfMonth[i]
          if (i % 7 === 0) {
            $tr = $('<tr></tr>')
            $dateTable.append($tr)
          }
          value = day
            ? ((id = `favorite_hobby_${i}`),
              `<input type='radio' name='hobby' id='${id}' /><label for='${id}'><span class='adg-visually-hidden'>${this.getDayName(
                day.getDay()
              )}, </span>${day.getDate()}<span class='adg-visually-hidden'> of ${
                this.config['monthNames'][day.getMonth()]
              } ${day.getFullYear()}</span></label>`)
            : ''
          $tr.append(`<td class='control'>${value}</td>`)
        }
        this.$options = this.$optionsContainer.find('input[type="radio"]')
        this.attachOptionsEvents()
        this.addAdgDataAttribute(this.labelOfInput(this.$options), 'option')
        return this.$options.addClass('adg-visually-hidden')
      }

      getDayName (day) {
        if (day === 0) {
          day = 6
        }
        return this.config['dayNames'][day - 1]
      }

      attachInputEvents () {
        this.attachClickEventToInput()
        this.attachEscapeKeyToInput()
        this.attachEnterKeyToInput()
        this.attachTabKeyToInput()
        return this.attachUpDownKeysToInput()
      }

      attachOptionsEvents () {
        this.attachArrowKeysToOptions()
        this.attachChangeEventToOptions()
        this.attachClickEventToOptionLabels()
        this.attachEnterEventToOptions()
        return this.attachTabEventToOptions()
      }

      attachClickEventToInput () {
        return this.$input.click(() => {
          if (this.$optionsContainer.is(':visible')) {
            return this.hideOptions()
          } else {
            return this.showOptions()
          }
        })
      }

      attachEscapeKeyToInput () {
        return this.$input.keydown(e => {
          if (e.which === 27) {
            if (this.$optionsContainer.is(':visible')) {
              this.applyCheckedOptionToInputAndResetOptions()
              return e.preventDefault()
            } else if (this.$options.is(':checked')) {
              this.$options.prop('checked', false)
              this.applyCheckedOptionToInputAndResetOptions()
              return e.preventDefault() // Needed for automatic testing only
            } else {
              return $('body').append('<p>Esc passed on.</p>')
            }
          }
        })
      }

      attachEnterKeyToInput () {
        return this.$input.keydown(e => {
          if (e.which === 13) {
            if (this.$optionsContainer.is(':visible')) {
              this.applyCheckedOptionToInputAndResetOptions()
              return e.preventDefault() // Needed for automatic testing only
            } else {
              return $('body').append('<p>Enter passed on.</p>')
            }
          }
        })
      }

      attachTabKeyToInput () {
        return this.$input.keydown(e => {
          if (e.which === 9) {
            if (this.$optionsContainer.is(':visible')) {
              return this.applyCheckedOptionToInputAndResetOptions()
            }
          }
        })
      }

      attachUpDownKeysToInput () {
        return this.$input.keydown(e => {
          if (e.which === 38 || e.which === 40) {
            this.showOptions()
            return e.preventDefault() // TODO: Test!
          }
        })
      }

      showOptions () {
        this.show(this.$optionsContainer)
        this.$input.attr('aria-expanded', 'true')
        if (this.$options.filter(':checked').length === 0) {
          this.currentDate = this.config['date']
          this.initDate()
          this.setSelection(this.currentDate.getDate() - 1)
        }
        return this.$options.filter(':checked').focus()
      }

      hideOptions () {
        this.hide(this.$optionsContainer)
        this.$input.attr('aria-expanded', 'false')
        return this.$input.focus()
      }

      moveSelection (direction) {
        var currentIndex, maxIndex, upcomingIndex
        maxIndex = this.$options.length - 1
        currentIndex = this.$options.index(
          this.$options.parent().find(':checked')
        ) // TODO: is parent() good here?!
        upcomingIndex =
          direction === 'left'
            ? currentIndex <= 0
              ? ((this.currentDate = this.previousMonth(this.currentDate)),
                this.initDate(),
                -1)
              : currentIndex - 1
            : direction === 'up'
              ? currentIndex - 7 < 0
                ? ((this.currentDate = this.previousMonth(this.currentDate)),
                  this.initDate(),
                  -1)
                : currentIndex - 7
              : direction === 'right'
                ? currentIndex === maxIndex
                  ? ((this.currentDate = this.nextMonth(this.currentDate)),
                    this.initDate(),
                    0)
                  : currentIndex + 1
                : direction === 'down'
                  ? currentIndex + 7 > maxIndex
                    ? ((this.currentDate = this.nextMonth(this.currentDate)),
                      this.initDate(),
                      0)
                    : currentIndex + 7
                  : void 0 // TODO: Calculate index for the current week day // TODO: Calculate index for the current week day
        return this.setSelection(upcomingIndex)
      }

      setSelection (current, change = true) {
        var $currentOption
        if (current === -1) {
          current = this.$options.length - 1
        }
        $currentOption = $(this.$options[current])
        $currentOption.prop('checked', true)
        if (change) {
          $currentOption.trigger('change')
          return $currentOption.focus()
        }
      }

      previousMonth (now) {
        if (now.getMonth() === 0) {
          return new Date(now.getFullYear() - 1, 11, 1)
        } else {
          return new Date(now.getFullYear(), now.getMonth() - 1, 1)
        }
      }

      nextMonth (now) {
        if (now.getMonth() === 11) {
          return new Date(now.getFullYear() + 1, 11, 1)
        } else {
          return new Date(now.getFullYear(), now.getMonth() + 1, 1)
        }
      }

      attachArrowKeysToOptions () {
        return this.$options.keydown(e => {
          if (
            e.which === 37 ||
            e.which === 38 ||
            e.which === 39 ||
            e.which === 40
          ) {
            if (e.which === 37) {
              this.moveSelection('left')
            } else if (e.which === 38) {
              this.moveSelection('up')
            } else if (e.which === 39) {
              this.moveSelection('right')
            } else if (e.which === 40) {
              this.moveSelection('down')
            }
            return e.preventDefault() // TODO: Test!
          }
        })
      }

      attachChangeEventToOptions () {
        return this.$options.change(e => {
          return this.applyCheckedOptionToInput()
        })
      }

      applyCheckedOptionToInputAndResetOptions () {
        this.applyCheckedOptionToInput()
        return this.hideOptions()
      }

      applyCheckedOptionToInput () {
        var $checkedOption, $checkedOptionLabel, $previouslyCheckedOptionLabel
        $previouslyCheckedOptionLabel = $(
          `[${this.adgDataAttributeName('option-selected')}]`
        )
        if ($previouslyCheckedOptionLabel.length === 1) {
          this.removeAdgDataAttribute(
            $previouslyCheckedOptionLabel,
            'option-selected'
          )
        }
        $checkedOption = this.$options.filter(':checked')
        if ($checkedOption.length === 1) {
          $checkedOptionLabel = this.labelOfInput($checkedOption)
          this.$input.val($.trim($checkedOptionLabel.text()))
          return this.addAdgDataAttribute(
            $checkedOptionLabel,
            'option-selected'
          )
        } else {
          return this.$input.val('')
        }
      }

      attachClickEventToOptionLabels () {
        return this.labelOfInput(this.$options).click(e => {
          return this.hideOptions()
        })
      }

      attachEnterEventToOptions () {
        return this.$options.keydown(e => {
          if (e.which === 13) {
            this.hideOptions()
            e.preventDefault()
            return e.stopPropagation()
          }
        })
      }

      attachTabEventToOptions () {
        return this.$options.keydown(e => {
          if (e.which === 9) {
            return this.hideOptions()
          }
        })
      }
    }

    config = {
      date: new Date(),
      dayNames: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday'
      ],
      monthNames: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
      ]
    }

    return AdgDatepicker
  }.call(this))

  $(document).ready(function () {
    return $('[data-adg-datepicker]').each(function () {
      return new AdgDatepicker(this)
    })
  })
}.call(this))

// # sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiPGFub255bW91cz4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFNOzs7SUFBTixNQUFBLGNBQUE7TUFNRSxXQUFhLENBQUMsRUFBRCxFQUFLLFVBQVUsQ0FBQSxDQUFmLENBQUE7UUFDWCxJQUFDLENBQUEsR0FBRCxHQUFPLENBQUEsQ0FBRSxFQUFGO1FBQ1AsSUFBQyxDQUFBLE1BQUQsR0FBVTtRQUVWLElBQUMsQ0FBQSxXQUFELEdBQWUsSUFBQyxDQUFBLE1BQU8sQ0FBQSxNQUFBO1FBRXZCLElBQUMsQ0FBQSxTQUFELENBQUE7UUFDQSxJQUFDLENBQUEsV0FBRCxDQUFBO1FBRUEsSUFBQyxDQUFBLHlCQUFELENBQUE7TUFUVyxDQUxiOzs7TUFpQkEsT0FBUyxDQUFDLFFBQUQsQ0FBQTtBQUNQLFlBQUE7UUFBQSxNQUFBLEdBQVMsSUFBQyxDQUFBLEdBQUcsQ0FBQyxJQUFMLENBQVUsUUFBVjtBQUNULGdCQUFPLE1BQU0sQ0FBQyxNQUFkO0FBQUEsZUFDTyxDQURQO21CQUNjLElBQUMsQ0FBQSxvQ0FBRCxDQUFzQyxDQUFBLG9CQUFBLENBQUEsQ0FBdUIsUUFBdkIsQ0FBZ0MsQ0FBaEMsQ0FBdEMsRUFBMEU7Y0FBQSxNQUFBLEVBQVE7WUFBUixDQUExRTtBQURkLGVBRU8sQ0FGUDttQkFFYyxDQUFBLENBQUUsTUFBTSxDQUFDLEtBQVAsQ0FBQSxDQUFGO0FBRmQ7bUJBR08sSUFBQyxDQUFBLG9DQUFELENBQXNDLENBQUEsK0JBQUEsQ0FBQSxDQUFrQyxRQUFsQyxDQUEyQyxDQUEzQyxDQUF0QyxFQUFxRjtjQUFBLE1BQUEsRUFBUTtZQUFSLENBQXJGO0FBSFA7TUFGTzs7TUFPVCxJQUFNLENBQUEsQ0FBQTtlQUNKO01BREk7O01BR04sbUJBQXFCLENBQUMsT0FBRCxFQUFVLElBQVYsRUFBZ0IsUUFBUSxFQUF4QixDQUFBO2VBQ25CLE9BQU8sQ0FBQyxJQUFSLENBQWEsSUFB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QVksVUFBWixFQUF3QixPQUF4QixFQUFpQyxPQUFqQyxFQUEwQyxLQUExQyxFQUFpRCxNQUFqRCxFQUF5RCxNQUF6RCxFQUFpRSxRQUFqRSxFQUEyRSxXQUEzRSxFQUF3RixTQUF4RixFQUFtRyxVQUFuRyxFQUErRyxVQUEvRztJQUZaOzs7Ozs7RUE4VUosQ0FBQSxDQUFFLFFBQUYsQ0FBVyxDQUFDLEtBQVosQ0FBa0IsUUFBQSxDQUFBLENBQUE7V0FDaEIsQ0FBQSxDQUFFLHVCQUFGLENBQTBCLENBQUMsSUFBM0IsQ0FBZ0MsUUFBQSxDQUFBLENBQUE7YUFDOUIsSUFBSSxhQUFKLENBQWtCLElBQWxCO0lBRDhCLENBQWhDO0VBRGdCLENBQWxCO0FBaFZBIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgQWRnRGF0ZXBpY2tlclxuICBjb25maWcgPVxuICAgIGRhdGU6ICAgICAgIG5ldyBEYXRlKClcbiAgICBkYXlOYW1lczogICBbXCJNb25kYXlcIiwgXCJUdWVzZGF5XCIsIFwiV2VkbmVzZGF5XCIsIFwiVGh1cnNkYXlcIiwgXCJGcmlkYXlcIiwgXCJTYXR1cmRheVwiLCBcIlN1bmRheVwiXVxuICAgIG1vbnRoTmFtZXM6IFtcIkphbnVhcnlcIiwgXCJGZWJydWFyeVwiLCBcIk1hcmNoXCIsIFwiQXByaWxcIiwgXCJNYXlcIiwgXCJKdW5lXCIsIFwiSnVseVwiLCBcIkF1Z3VzdFwiLCBcIlNlcHRlbWJlclwiLCBcIk9jdG9iZXJcIiwgXCJOb3ZlbWJlclwiLCBcIkRlY2VtYmVyXCJdXG4gIFxuICBjb25zdHJ1Y3RvcjogKGVsLCBvcHRpb25zID0ge30pIC0+XG4gICAgQCRlbCA9ICQoZWwpXG4gICAgQGNvbmZpZyA9IGNvbmZpZ1xuICAgIFxuICAgIEBjdXJyZW50RGF0ZSA9IEBjb25maWdbXCJkYXRlXCJdXG5cbiAgICBAaW5pdElucHV0KClcbiAgICBAaW5pdE9wdGlvbnMoKVxuXG4gICAgQGFwcGx5Q2hlY2tlZE9wdGlvblRvSW5wdXQoKVxuXG4gICMgRXhlY3V0ZXMgdGhlIGdpdmVuIHNlbGVjdG9yIG9uIEAkZWwgYW5kIHJldHVybnMgdGhlIGVsZW1lbnQuIE1ha2VzIHN1cmUgZXhhY3RseSBvbmUgZWxlbWVudCBleGlzdHMuXG4gIGZpbmRPbmU6IChzZWxlY3RvcikgLT5cbiAgICByZXN1bHQgPSBAJGVsLmZpbmQoc2VsZWN0b3IpXG4gICAgc3dpdGNoIHJlc3VsdC5sZW5ndGhcbiAgICAgIHdoZW4gMCB0aGVuIEB0aHJvd01lc3NhZ2VBbmRQcmludE9iamVjdHNUb0NvbnNvbGUgXCJObyBvYmplY3QgZm91bmQgZm9yICN7c2VsZWN0b3J9IVwiLCByZXN1bHQ6IHJlc3VsdFxuICAgICAgd2hlbiAxIHRoZW4gJChyZXN1bHQuZmlyc3QoKSlcbiAgICAgIGVsc2UgQHRocm93TWVzc2FnZUFuZFByaW50T2JqZWN0c1RvQ29uc29sZSBcIk1vcmUgdGhhbiBvbmUgb2JqZWN0IGZvdW5kIGZvciAje3NlbGVjdG9yfSFcIiwgcmVzdWx0OiByZXN1bHRcbiAgICAgICAgXG4gIG5hbWU6IC0+XG4gICAgXCJhZGctZGF0ZXBpY2tlclwiXG4gICAgICAgIFxuICBhZGRBZGdEYXRhQXR0cmlidXRlOiAoJHRhcmdldCwgbmFtZSwgdmFsdWUgPSAnJykgLT5cbiAgICAkdGFyZ2V0LmF0dHIoQGFkZ0RhdGFBdHRyaWJ1dGVOYW1lKG5hbWUpLCB2YWx1ZSlcbiAgICAgICAgXG4gIHJlbW92ZUFkZ0RhdGFBdHRyaWJ1dGU6ICgkdGFyZ2V0LCBuYW1lKSAtPlxuICAgICR0YXJnZXQucmVtb3ZlQXR0cihAYWRnRGF0YUF0dHJpYnV0ZU5hbWUobmFtZSkpXG4gICAgXG4gIGFkZ0RhdGFBdHRyaWJ1dGVOYW1lOiAobmFtZSA9IG51bGwpIC0+XG4gICAgcmVzdWx0ID0gXCJkYXRhLSN7QG5hbWUoKX1cIlxuICAgIHJlc3VsdCArPSBcIi0je25hbWV9XCIgaWYgbmFtZVxuICAgIHJlc3VsdFxuICAgIFxuICBsYWJlbE9mSW5wdXQ6ICgkaW5wdXRzKSAtPlxuICAgICRpbnB1dHMubWFwIChpLCBpbnB1dCkgPT5cbiAgICAgICRpbnB1dCA9ICQoaW5wdXQpXG4gICAgICBcbiAgICAgIGlkID0gJGlucHV0LmF0dHIoJ2lkJylcbiAgICAgICRsYWJlbCA9IEBmaW5kT25lKFwibGFiZWxbZm9yPScje2lkfSddXCIpWzBdXG5cbiAgICAgIGlmICRsYWJlbC5sZW5ndGggPT0gMFxuICAgICAgICAkbGFiZWwgPSAkaW5wdXQuY2xvc2VzdCgnbGFiZWwnKVxuICAgICAgICBAdGhyb3dNZXNzYWdlQW5kUHJpbnRPYmplY3RzVG9Db25zb2xlIFwiTm8gY29ycmVzcG9uZGluZyBpbnB1dCBmb3VuZCBmb3IgaW5wdXQhXCIsIGlucHV0OiAkaW5wdXQgaWYgJGxhYmVsLmxlbmd0aCA9PSAwXG5cbiAgICAgICRsYWJlbFxuXG4gIHNob3c6ICgkZWwpIC0+XG4gICAgJGVsLnJlbW92ZUF0dHIoJ2hpZGRlbicpXG4gICAgJGVsLnNob3coKVxuXG4gICAgIyBUT0RPIFdvdWxkIGJlIGNvb2wgdG8gcmVub3VuY2UgQ1NTIGFuZCBzb2xlbHkgdXNlIHRoZSBoaWRkZW4gYXR0cmlidXRlLiBCdXQgalF1ZXJ5J3MgOnZpc2libGUgZG9lc24ndCBzZWVtIHRvIHdvcmsgd2l0aCBpdCE/XG4gICAgIyBAdGhyb3dNZXNzYWdlQW5kUHJpbnRPYmplY3RzVG9Db25zb2xlKFwiRWxlbWVudCBpcyBzdGlsbCBoaWRkZW4sIGFsdGhvdWdoIGhpZGRlbiBhdHRyaWJ1dGUgd2FzIHJlbW92ZWQhIE1ha2Ugc3VyZSB0aGVyZSdzIG5vIENTUyBsaWtlIGRpc3BsYXk6bm9uZSBvciB2aXNpYmlsaXR5OmhpZGRlbiBsZWZ0IG9uIGl0IVwiLCBlbGVtZW50OiAkZWwpIGlmICRlbC5pcygnOmhpZGRlbicpXG5cbiAgaGlkZTogKCRlbCkgLT5cbiAgICAkZWwuYXR0cignaGlkZGVuJywgJycpXG4gICAgJGVsLmhpZGUoKVxuICAgIFxuICB0aHJvd01lc3NhZ2VBbmRQcmludE9iamVjdHNUb0NvbnNvbGU6IChtZXNzYWdlLCBlbGVtZW50cyA9IHt9KSAtPlxuICAgIGNvbnNvbGUubG9nIGVsZW1lbnRzXG4gICAgdGhyb3cgbWVzc2FnZVxuICAgIFxuICB0ZXh0OiAodGV4dCwgb3B0aW9ucyA9IHt9KSAtPlxuICAgIHRleHQgPSBAY29uZmlnW1wiI3t0ZXh0fVRleHRcIl1cbiAgICBcbiAgICBmb3Iga2V5LCB2YWx1ZSBvZiBvcHRpb25zXG4gICAgICB0ZXh0ID0gdGV4dC5yZXBsYWNlIFwiWyN7a2V5fV1cIiwgdmFsdWVcbiAgICAgIFxuICAgIHRleHRcblxuICBpbml0SW5wdXQ6IC0+XG4gICAgQCRpbnB1dCA9IEBmaW5kT25lKCdpbnB1dFt0eXBlPVwidGV4dFwiXScpXG4gICAgQCRpbnB1dC5hdHRyKCdhdXRvY29tcGxldGUnLCAnb2ZmJylcbiAgICBAJGlucHV0LmF0dHIoJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnKVxuICAgIEBhdHRhY2hJbnB1dEV2ZW50cygpXG5cbiAgaW5pdE9wdGlvbnM6IC0+XG4gICAgQCRvcHRpb25zQ29udGFpbmVyID0gQGZpbmRPbmUoJ2ZpZWxkc2V0JylcbiAgICBAYWRkQWRnRGF0YUF0dHJpYnV0ZShAJG9wdGlvbnNDb250YWluZXIsICdvcHRpb25zJylcblxuICAgIEAkb3B0aW9uc0NvbnRhaW5lckxhYmVsID0gQGZpbmRPbmUoJ2xlZ2VuZCcpXG4gICAgQCRvcHRpb25zQ29udGFpbmVyTGFiZWwuYWRkQ2xhc3MoJ2FkZy12aXN1YWxseS1oaWRkZW4nKVxuICAgIFxuICAgIEBpbml0RGF0ZSgpXG4gICAgQHNldFNlbGVjdGlvbihAY3VycmVudERhdGUuZ2V0RGF0ZSgpIC0gMSwgZmFsc2UpXG4gICAgXG4gIGdldEZpcnN0TW9udGhEYXk6IChkYXRlKSAtPlxuICAgIHkgPSBkYXRlLmdldEZ1bGxZZWFyKClcbiAgICBtID0gZGF0ZS5nZXRNb250aCgpXG4gICAgbmV3IERhdGUoeSwgbSwgMSlcbiAgICBcbiAgZ2V0TGFzdE1vbnRoRGF5OiAoZGF0ZSkgLT5cbiAgICB5ID0gZGF0ZS5nZXRGdWxsWWVhcigpXG4gICAgbSA9IGRhdGUuZ2V0TW9udGgoKVxuICAgIG5ldyBEYXRlKHksIG0gKyAxLCAwKVxuICAgIFxuICBpbml0RGF0ZTogKCkgLT5cbiAgICBAJG9wdGlvbnNDb250YWluZXIuZmluZChcInRhYmxlXCIpLnJlbW92ZSgpXG4gICAgJGRhdGVUYWJsZSA9ICQoXCI8dGFibGUgYm9yZGVyPScxJz48Y2FwdGlvbj4je0Bjb25maWdbXCJtb250aE5hbWVzXCJdW0BjdXJyZW50RGF0ZS5nZXRNb250aCgpXX0gI3tAY3VycmVudERhdGUuZ2V0RnVsbFllYXIoKX08L2NhcHRpb24+PHRoZWFkPjwvdGhlYWQ+PC90YWJsZT5cIilcbiAgICBmb3Igd2Vla2RheSBpbiBAY29uZmlnW1wiZGF5TmFtZXNcIl1cbiAgICAgICRkYXRlVGFibGUuZmluZChcInRoZWFkXCIpLmFwcGVuZChcIjx0aD4je3dlZWtkYXl9PC90aD5cIilcbiAgICAgIFxuICAgIEAkb3B0aW9uc0NvbnRhaW5lci5hcHBlbmQoJGRhdGVUYWJsZSlcbiAgICBcbiAgICBmaXJzdERheSA9IEBnZXRGaXJzdE1vbnRoRGF5KEBjdXJyZW50RGF0ZSlcbiAgICBsYXN0RGF5ID0gQGdldExhc3RNb250aERheShAY3VycmVudERhdGUpXG4gICAgXG4gICAgZGF5c09mTW9udGggPSBbXVxuICAgIGRheSA9IGZpcnN0RGF5XG4gICAgd2hpbGUgZGF5IDw9IGxhc3REYXlcbiAgICAgIGRheXNPZk1vbnRoLnB1c2ggbmV3IERhdGUoZGF5KVxuICAgICAgZGF5LnNldERhdGUgZGF5LmdldERhdGUoKSArIDFcbiAgICAgIFxuICAgICMgQWRkIGVtcHR5IGRheXMgYXQgYmVnaW5uaW5nXG4gICAgaSA9IDFcbiAgICBmaXJzdERheSA9IGRheXNPZk1vbnRoWzBdLmdldERheSgpXG4gICAgd2hpbGUgaSA8IGZpcnN0RGF5XG4gICAgICBkYXlzT2ZNb250aC51bnNoaWZ0IG51bGxcbiAgICAgIGkrK1xuICAgICAgXG4gICAgIyBBZGQgZW1wdHkgZGF5cyBhdCBlbmRcbiAgICBpID0gZGF5c09mTW9udGhbZGF5c09mTW9udGgubGVuZ3RoIC0gMV0uZ2V0RGF5KClcbiAgICB3aGlsZSBpID4gMCAmJiBpIDwgNlxuICAgICAgZGF5c09mTW9udGgucHVzaCBudWxsXG4gICAgICBpKytcbiAgICAgIFxuICAgICR0ciA9IG51bGxcbiAgICBmb3IgZGF5LCBpIGluIGRheXNPZk1vbnRoXG4gICAgICBpZiBpICUgNyA9PSAwXG4gICAgICAgICR0ciA9ICQoXCI8dHI+PC90cj5cIilcbiAgICAgICAgJGRhdGVUYWJsZS5hcHBlbmQoJHRyKVxuICAgICAgICBcbiAgICAgIHZhbHVlID0gaWYgZGF5XG4gICAgICAgICAgICAgICAgaWQgPSBcImZhdm9yaXRlX2hvYmJ5XyN7aX1cIlxuXG4gICAgICAgICAgICAgICAgXCI8aW5wdXQgdHlwZT0ncmFkaW8nIG5hbWU9J2hvYmJ5JyBpZD0nI3tpZH0nIC8+PGxhYmVsIGZvcj0nI3tpZH0nPjxzcGFuIGNsYXNzPSdhZGctdmlzdWFsbHktaGlkZGVuJz4je0BnZXREYXlOYW1lKGRheS5nZXREYXkoKSl9LCA8L3NwYW4+I3tkYXkuZ2V0RGF0ZSgpfTxzcGFuIGNsYXNzPSdhZGctdmlzdWFsbHktaGlkZGVuJz4gb2YgI3tAY29uZmlnWydtb250aE5hbWVzJ11bZGF5LmdldE1vbnRoKCldfSAje2RheS5nZXRGdWxsWWVhcigpfTwvc3Bhbj48L2xhYmVsPlwiXG4gICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBcIlwiXG4gICAgICAkdHIuYXBwZW5kKFwiPHRkIGNsYXNzPSdjb250cm9sJz4je3ZhbHVlfTwvdGQ+XCIpXG4gICAgICBcbiAgICBAJG9wdGlvbnMgPSBAJG9wdGlvbnNDb250YWluZXIuZmluZCgnaW5wdXRbdHlwZT1cInJhZGlvXCJdJylcbiAgICBAYXR0YWNoT3B0aW9uc0V2ZW50cygpXG5cbiAgICBAYWRkQWRnRGF0YUF0dHJpYnV0ZShAbGFiZWxPZklucHV0KEAkb3B0aW9ucyksICdvcHRpb24nKVxuICAgIEAkb3B0aW9ucy5hZGRDbGFzcygnYWRnLXZpc3VhbGx5LWhpZGRlbicpXG4gICAgXG4gIGdldERheU5hbWU6IChkYXkpIC0+XG4gICAgZGF5ID0gNiBpZiBkYXkgPT0gMFxuICAgIEBjb25maWdbJ2RheU5hbWVzJ11bZGF5IC0gMV1cblxuICBhdHRhY2hJbnB1dEV2ZW50czogLT5cbiAgICBAYXR0YWNoQ2xpY2tFdmVudFRvSW5wdXQoKVxuXG4gICAgQGF0dGFjaEVzY2FwZUtleVRvSW5wdXQoKVxuICAgIEBhdHRhY2hFbnRlcktleVRvSW5wdXQoKVxuICAgIEBhdHRhY2hUYWJLZXlUb0lucHV0KClcbiAgICBAYXR0YWNoVXBEb3duS2V5c1RvSW5wdXQoKVxuXG4gIGF0dGFjaE9wdGlvbnNFdmVudHM6IC0+XG4gICAgQGF0dGFjaEFycm93S2V5c1RvT3B0aW9ucygpXG4gICAgQGF0dGFjaENoYW5nZUV2ZW50VG9PcHRpb25zKClcbiAgICBAYXR0YWNoQ2xpY2tFdmVudFRvT3B0aW9uTGFiZWxzKClcbiAgICBAYXR0YWNoRW50ZXJFdmVudFRvT3B0aW9ucygpXG4gICAgQGF0dGFjaFRhYkV2ZW50VG9PcHRpb25zKClcblxuICBhdHRhY2hDbGlja0V2ZW50VG9JbnB1dDogLT5cbiAgICBAJGlucHV0LmNsaWNrID0+XG4gICAgICBpZiBAJG9wdGlvbnNDb250YWluZXIuaXMoJzp2aXNpYmxlJylcbiAgICAgICAgQGhpZGVPcHRpb25zKClcbiAgICAgIGVsc2VcbiAgICAgICAgQHNob3dPcHRpb25zKClcblxuICBhdHRhY2hFc2NhcGVLZXlUb0lucHV0OiAtPlxuICAgIEAkaW5wdXQua2V5ZG93biAoZSkgPT5cbiAgICAgIGlmIGUud2hpY2ggPT0gMjdcbiAgICAgICAgaWYgQCRvcHRpb25zQ29udGFpbmVyLmlzKCc6dmlzaWJsZScpXG4gICAgICAgICAgQGFwcGx5Q2hlY2tlZE9wdGlvblRvSW5wdXRBbmRSZXNldE9wdGlvbnMoKVxuICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgICBlbHNlIGlmIEAkb3B0aW9ucy5pcygnOmNoZWNrZWQnKVxuICAgICAgICAgIEAkb3B0aW9ucy5wcm9wKCdjaGVja2VkJywgZmFsc2UpXG4gICAgICAgICAgQGFwcGx5Q2hlY2tlZE9wdGlvblRvSW5wdXRBbmRSZXNldE9wdGlvbnMoKVxuICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgICBlbHNlICMgTmVlZGVkIGZvciBhdXRvbWF0aWMgdGVzdGluZyBvbmx5XG4gICAgICAgICAgJCgnYm9keScpLmFwcGVuZCgnPHA+RXNjIHBhc3NlZCBvbi48L3A+JylcblxuICBhdHRhY2hFbnRlcktleVRvSW5wdXQ6IC0+XG4gICAgQCRpbnB1dC5rZXlkb3duIChlKSA9PlxuICAgICAgaWYgZS53aGljaCA9PSAxM1xuICAgICAgICBpZiBAJG9wdGlvbnNDb250YWluZXIuaXMoJzp2aXNpYmxlJylcbiAgICAgICAgICBAYXBwbHlDaGVja2VkT3B0aW9uVG9JbnB1dEFuZFJlc2V0T3B0aW9ucygpXG4gICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgIGVsc2UgIyBOZWVkZWQgZm9yIGF1dG9tYXRpYyB0ZXN0aW5nIG9ubHlcbiAgICAgICAgICAkKCdib2R5JykuYXBwZW5kKCc8cD5FbnRlciBwYXNzZWQgb24uPC9wPicpXG5cbiAgYXR0YWNoVGFiS2V5VG9JbnB1dDogLT5cbiAgICBAJGlucHV0LmtleWRvd24gKGUpID0+XG4gICAgICBpZiBlLndoaWNoID09IDlcbiAgICAgICAgaWYgQCRvcHRpb25zQ29udGFpbmVyLmlzKCc6dmlzaWJsZScpXG4gICAgICAgICAgQGFwcGx5Q2hlY2tlZE9wdGlvblRvSW5wdXRBbmRSZXNldE9wdGlvbnMoKVxuXG4gIGF0dGFjaFVwRG93bktleXNUb0lucHV0OiAtPlxuICAgIEAkaW5wdXQua2V5ZG93biAoZSkgPT5cbiAgICAgIGlmIGUud2hpY2ggPT0gMzggfHwgZS53aGljaCA9PSA0MFxuICAgICAgICBAc2hvd09wdGlvbnMoKVxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCkgIyBUT0RPOiBUZXN0IVxuXG4gIHNob3dPcHRpb25zOiAtPlxuICAgIEBzaG93KEAkb3B0aW9uc0NvbnRhaW5lcilcbiAgICBAJGlucHV0LmF0dHIoJ2FyaWEtZXhwYW5kZWQnLCAndHJ1ZScpXG4gICAgXG4gICAgaWYgQCRvcHRpb25zLmZpbHRlcignOmNoZWNrZWQnKS5sZW5ndGggPT0gMFxuICAgICAgQGN1cnJlbnREYXRlID0gQGNvbmZpZ1tcImRhdGVcIl1cbiAgICAgIEBpbml0RGF0ZSgpXG4gICAgICBAc2V0U2VsZWN0aW9uKEBjdXJyZW50RGF0ZS5nZXREYXRlKCkgLSAxKVxuXG4gICAgQCRvcHRpb25zLmZpbHRlcignOmNoZWNrZWQnKS5mb2N1cygpXG5cbiAgaGlkZU9wdGlvbnM6IC0+XG4gICAgQGhpZGUoQCRvcHRpb25zQ29udGFpbmVyKVxuICAgIEAkaW5wdXQuYXR0cignYXJpYS1leHBhbmRlZCcsICdmYWxzZScpXG4gICAgQCRpbnB1dC5mb2N1cygpXG5cbiAgbW92ZVNlbGVjdGlvbjogKGRpcmVjdGlvbikgLT5cbiAgICBtYXhJbmRleCA9IEAkb3B0aW9ucy5sZW5ndGggLSAxXG4gICAgY3VycmVudEluZGV4ID0gQCRvcHRpb25zLmluZGV4KEAkb3B0aW9ucy5wYXJlbnQoKS5maW5kKCc6Y2hlY2tlZCcpKSAjIFRPRE86IGlzIHBhcmVudCgpIGdvb2QgaGVyZT8hXG4gICAgXG4gICAgdXBjb21pbmdJbmRleCA9IGlmIGRpcmVjdGlvbiA9PSAnbGVmdCdcbiAgICAgICAgICAgICAgICAgICAgICBpZiBjdXJyZW50SW5kZXggPD0gMFxuICAgICAgICAgICAgICAgICAgICAgICAgQGN1cnJlbnREYXRlID0gQHByZXZpb3VzTW9udGgoQGN1cnJlbnREYXRlKVxuICAgICAgICAgICAgICAgICAgICAgICAgQGluaXREYXRlKClcbiAgICAgICAgICAgICAgICAgICAgICAgIC0xXG4gICAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudEluZGV4IC0gMVxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIGRpcmVjdGlvbiA9PSAndXAnXG4gICAgICAgICAgICAgICAgICAgICAgaWYgY3VycmVudEluZGV4IC0gNyA8IDBcbiAgICAgICAgICAgICAgICAgICAgICAgIEBjdXJyZW50RGF0ZSA9IEBwcmV2aW91c01vbnRoKEBjdXJyZW50RGF0ZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIEBpbml0RGF0ZSgpXG4gICAgICAgICAgICAgICAgICAgICAgICAtMSAjIFRPRE86IENhbGN1bGF0ZSBpbmRleCBmb3IgdGhlIGN1cnJlbnQgd2VlayBkYXlcbiAgICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50SW5kZXggLSA3XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgZGlyZWN0aW9uID09ICdyaWdodCdcbiAgICAgICAgICAgICAgICAgICAgICBpZiBjdXJyZW50SW5kZXggPT0gbWF4SW5kZXhcbiAgICAgICAgICAgICAgICAgICAgICAgIEBjdXJyZW50RGF0ZSA9IEBuZXh0TW9udGgoQGN1cnJlbnREYXRlKVxuICAgICAgICAgICAgICAgICAgICAgICAgQGluaXREYXRlKClcbiAgICAgICAgICAgICAgICAgICAgICAgIDBcbiAgICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50SW5kZXggKyAxXG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgZGlyZWN0aW9uID09ICdkb3duJ1xuICAgICAgICAgICAgICAgICAgICAgIGlmIGN1cnJlbnRJbmRleCArIDcgPiBtYXhJbmRleFxuICAgICAgICAgICAgICAgICAgICAgICAgQGN1cnJlbnREYXRlID0gQG5leHRNb250aChAY3VycmVudERhdGUpXG4gICAgICAgICAgICAgICAgICAgICAgICBAaW5pdERhdGUoKVxuICAgICAgICAgICAgICAgICAgICAgICAgMCAjIFRPRE86IENhbGN1bGF0ZSBpbmRleCBmb3IgdGhlIGN1cnJlbnQgd2VlayBkYXlcbiAgICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50SW5kZXggKyA3XG5cbiAgICBAc2V0U2VsZWN0aW9uKHVwY29taW5nSW5kZXgpXG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgc2V0U2VsZWN0aW9uOiAoY3VycmVudCwgY2hhbmdlID0gdHJ1ZSkgLT5cbiAgICBpZiBjdXJyZW50ID09IC0xXG4gICAgICBjdXJyZW50ID0gQCRvcHRpb25zLmxlbmd0aCAtIDFcbiAgICAgIFxuICAgICRjdXJyZW50T3B0aW9uID0gJChAJG9wdGlvbnNbY3VycmVudF0pXG4gICAgJGN1cnJlbnRPcHRpb24ucHJvcCgnY2hlY2tlZCcsIHRydWUpXG4gIFxuICAgIGlmIGNoYW5nZVxuICAgICAgJGN1cnJlbnRPcHRpb24udHJpZ2dlcignY2hhbmdlJylcbiAgICAgICRjdXJyZW50T3B0aW9uLmZvY3VzKClcbiAgICBcbiAgcHJldmlvdXNNb250aDogKG5vdykgLT5cbiAgICBpZiBub3cuZ2V0TW9udGgoKSA9PSAwXG4gICAgICBuZXcgRGF0ZShub3cuZ2V0RnVsbFllYXIoKSAtIDEsIDExLCAxKVxuICAgIGVsc2VcbiAgICAgIG5ldyBEYXRlKG5vdy5nZXRGdWxsWWVhcigpLCBub3cuZ2V0TW9udGgoKSAtIDEsIDEpXG4gICAgXG4gIG5leHRNb250aDogKG5vdykgLT5cbiAgICBpZiBub3cuZ2V0TW9udGgoKSA9PSAxMVxuICAgICAgbmV3IERhdGUobm93LmdldEZ1bGxZZWFyKCkgKyAxLCAxMSwgMSlcbiAgICBlbHNlXG4gICAgICBuZXcgRGF0ZShub3cuZ2V0RnVsbFllYXIoKSwgbm93LmdldE1vbnRoKCkgKyAxLCAxKVxuXG4gIGF0dGFjaEFycm93S2V5c1RvT3B0aW9uczogLT5cbiAgICBAJG9wdGlvbnMua2V5ZG93biAoZSkgPT5cbiAgICAgIGlmIGUud2hpY2ggPT0gMzcgfHwgZS53aGljaCA9PSAzOCB8fCBlLndoaWNoID09IDM5IHx8IGUud2hpY2ggPT0gNDBcbiAgICAgICAgaWYgZS53aGljaCA9PSAzN1xuICAgICAgICAgIEBtb3ZlU2VsZWN0aW9uKCdsZWZ0JylcbiAgICAgICAgZWxzZSBpZiBlLndoaWNoID09IDM4XG4gICAgICAgICAgQG1vdmVTZWxlY3Rpb24oJ3VwJylcbiAgICAgICAgZWxzZSBpZiBlLndoaWNoID09IDM5XG4gICAgICAgICAgQG1vdmVTZWxlY3Rpb24oJ3JpZ2h0JylcbiAgICAgICAgZWxzZSBpZiBlLndoaWNoID09IDQwXG4gICAgICAgICAgQG1vdmVTZWxlY3Rpb24oJ2Rvd24nKVxuICAgICAgICAgIFxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCkgIyBUT0RPOiBUZXN0IVxuICBcbiAgYXR0YWNoQ2hhbmdlRXZlbnRUb09wdGlvbnM6IC0+XG4gICAgQCRvcHRpb25zLmNoYW5nZSAoZSkgPT5cbiAgICAgIEBhcHBseUNoZWNrZWRPcHRpb25Ub0lucHV0KClcblxuICBhcHBseUNoZWNrZWRPcHRpb25Ub0lucHV0QW5kUmVzZXRPcHRpb25zOiAtPlxuICAgIEBhcHBseUNoZWNrZWRPcHRpb25Ub0lucHV0KClcbiAgICBAaGlkZU9wdGlvbnMoKVxuXG4gIGFwcGx5Q2hlY2tlZE9wdGlvblRvSW5wdXQ6IC0+XG4gICAgJHByZXZpb3VzbHlDaGVja2VkT3B0aW9uTGFiZWwgPSAkKFwiWyN7QGFkZ0RhdGFBdHRyaWJ1dGVOYW1lKCdvcHRpb24tc2VsZWN0ZWQnKX1dXCIpXG4gICAgaWYgJHByZXZpb3VzbHlDaGVja2VkT3B0aW9uTGFiZWwubGVuZ3RoID09IDFcbiAgICAgIEByZW1vdmVBZGdEYXRhQXR0cmlidXRlKCRwcmV2aW91c2x5Q2hlY2tlZE9wdGlvbkxhYmVsLCAnb3B0aW9uLXNlbGVjdGVkJylcblxuICAgICRjaGVja2VkT3B0aW9uID0gQCRvcHRpb25zLmZpbHRlcignOmNoZWNrZWQnKVxuICAgIGlmICRjaGVja2VkT3B0aW9uLmxlbmd0aCA9PSAxXG4gICAgICAkY2hlY2tlZE9wdGlvbkxhYmVsID0gQGxhYmVsT2ZJbnB1dCgkY2hlY2tlZE9wdGlvbilcbiAgICAgIEAkaW5wdXQudmFsKCQudHJpbSgkY2hlY2tlZE9wdGlvbkxhYmVsLnRleHQoKSkpXG4gICAgICBAYWRkQWRnRGF0YUF0dHJpYnV0ZSgkY2hlY2tlZE9wdGlvbkxhYmVsLCAnb3B0aW9uLXNlbGVjdGVkJylcbiAgICBlbHNlXG4gICAgICBAJGlucHV0LnZhbCgnJylcblxuICBhdHRhY2hDbGlja0V2ZW50VG9PcHRpb25MYWJlbHM6IC0+XG4gICAgQGxhYmVsT2ZJbnB1dChAJG9wdGlvbnMpLmNsaWNrIChlKSA9PlxuICAgICAgQGhpZGVPcHRpb25zKClcblxuICBhdHRhY2hFbnRlckV2ZW50VG9PcHRpb25zOiAtPlxuICAgIEAkb3B0aW9ucy5rZXlkb3duIChlKSA9PlxuICAgICAgaWYgZS53aGljaCA9PSAxM1xuICAgICAgICBAaGlkZU9wdGlvbnMoKVxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKVxuXG4gIGF0dGFjaFRhYkV2ZW50VG9PcHRpb25zOiAtPlxuICAgIEAkb3B0aW9ucy5rZXlkb3duIChlKSA9PlxuICAgICAgaWYgZS53aGljaCA9PSA5XG4gICAgICAgIEBoaWRlT3B0aW9ucygpXG4gICAgXG4kKGRvY3VtZW50KS5yZWFkeSAtPlxuICAkKCdbZGF0YS1hZGctZGF0ZXBpY2tlcl0nKS5lYWNoIC0+XG4gICAgbmV3IEFkZ0RhdGVwaWNrZXIgQCJdfQ==
// # sourceURL=coffeescript
