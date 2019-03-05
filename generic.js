;(() => {
  // Stuff to block medium crap
  const mediumBlocker = () => {
    /**
     * This probably also blocks login modals and stuff - oh well
     */
    const CSS_INJECT_CODE = `
    .overlay.overlay--lighter {
      display: none;
    }
    `

    const styleNode = document.createElement('style')
    styleNode.type = 'text/css'
    const textNode = document.createTextNode(CSS_INJECT_CODE)
    styleNode.appendChild(textNode)

    document.head.appendChild(styleNode)
  }

  // Stuff to block fb crap
  const fbBlocker = () => {
    function _priv_debounce (func, wait, immediate) {
      var timeout
      return function () {
        var context = this

        var args = arguments
        var later = function () {
          timeout = null
          if (!immediate) func.apply(context, args)
        }
        var callNow = immediate && !timeout
        clearTimeout(timeout)
        timeout = setTimeout(later, wait)
        if (callNow) func.apply(context, args)
      }
    }

    window.addEventListener(
      'scroll',
      _priv_debounce(
        () => {
          setTimeout(() => {
            // hide jobs near you
            document
              .querySelectorAll('[title="Jobs near you"]')
              .forEach(node => (node.style = 'display: none;'))
            // hide sponsored content
            document
              .querySelectorAll('[data-testid="story-subtitle"]')
              .forEach(node => {
                ;/sponsored/i.test(node.innerText) &&
                  (node.closest('[data-insertion-position]').style =
                    'display: none;')
              })
          }, 0)
        },
        10,
        false
      )
    )
  }

  const isFb = () => /^www\.facebook/i.test(window.location.host)
  const isMediumSite = () =>
    document.head.querySelector('meta[property="al:android:app_name"]') &&
    /^medium$/i.test(
      document.head
        .querySelector('meta[property="al:android:app_name"]')
        .getAttribute('content')
    )

  // Run detection if actually on page and stuff
  isFb() && fbBlocker()
  isMediumSite() && mediumBlocker()
})()
