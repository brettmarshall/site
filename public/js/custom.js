	// Plugins File

	/*
 * Salvattore 1.0.4 by @rnmp and @ppold
 * https://github.com/rnmp/salvattore
 */


(function(root, factory) {
    if(typeof exports === 'object') {
        module.exports = factory();
    }
    else if(typeof define === 'function' && define.amd) {
        define('salvattore', [], factory);
    }
    else {
        root.salvattore = factory();
    }
}(this, function() {
/*! matchMedia() polyfill - Test a CSS media type/query in JS. Authors & copyright (c) 2012: Scott Jehl, Paul Irish, Nicholas Zakas, David Knight. Dual MIT/BSD license */

window.matchMedia || (window.matchMedia = function() {
    "use strict";

    // For browsers that support matchMedium api such as IE 9 and webkit
    var styleMedia = (window.styleMedia || window.media);

    // For those that don't support matchMedium
    if (!styleMedia) {
        var style       = document.createElement('style'),
            script      = document.getElementsByTagName('script')[0],
            info        = null;

        style.type  = 'text/css';
        style.id    = 'matchmediajs-test';

        script.parentNode.insertBefore(style, script);

        // 'style.currentStyle' is used by IE <= 8 and 'window.getComputedStyle' for all other browsers
        info = ('getComputedStyle' in window) && window.getComputedStyle(style, null) || style.currentStyle;

        styleMedia = {
            matchMedium: function(media) {
                var text = '@media ' + media + '{ #matchmediajs-test { width: 1px; } }';

                // 'style.styleSheet' is used by IE <= 8 and 'style.textContent' for all other browsers
                if (style.styleSheet) {
                    style.styleSheet.cssText = text;
                } else {
                    style.textContent = text;
                }

                // Test if media query is true or false
                return info.width === '1px';
            }
        };
    }

    return function(media) {
        return {
            matches: styleMedia.matchMedium(media || 'all'),
            media: media || 'all'
        };
    };
}());
;/*! matchMedia() polyfill addListener/removeListener extension. Author & copyright (c) 2012: Scott Jehl. Dual MIT/BSD license */
(function(){
    // Bail out for browsers that have addListener support
    if (window.matchMedia && window.matchMedia('all').addListener) {
        return false;
    }

    var localMatchMedia = window.matchMedia,
        hasMediaQueries = localMatchMedia('only all').matches,
        isListening     = false,
        timeoutID       = 0,    // setTimeout for debouncing 'handleChange'
        queries         = [],   // Contains each 'mql' and associated 'listeners' if 'addListener' is used
        handleChange    = function(evt) {
            // Debounce
            clearTimeout(timeoutID);

            timeoutID = setTimeout(function() {
                for (var i = 0, il = queries.length; i < il; i++) {
                    var mql         = queries[i].mql,
                        listeners   = queries[i].listeners || [],
                        matches     = localMatchMedia(mql.media).matches;

                    // Update mql.matches value and call listeners
                    // Fire listeners only if transitioning to or from matched state
                    if (matches !== mql.matches) {
                        mql.matches = matches;

                        for (var j = 0, jl = listeners.length; j < jl; j++) {
                            listeners[j].call(window, mql);
                        }
                    }
                }
            }, 30);
        };

    window.matchMedia = function(media) {
        var mql         = localMatchMedia(media),
            listeners   = [],
            index       = 0;

        mql.addListener = function(listener) {
            // Changes would not occur to css media type so return now (Affects IE <= 8)
            if (!hasMediaQueries) {
                return;
            }

            // Set up 'resize' listener for browsers that support CSS3 media queries (Not for IE <= 8)
            // There should only ever be 1 resize listener running for performance
            if (!isListening) {
                isListening = true;
                window.addEventListener('resize', handleChange, true);
            }

            // Push object only if it has not been pushed already
            if (index === 0) {
                index = queries.push({
                    mql         : mql,
                    listeners   : listeners
                });
            }

            listeners.push(listener);
        };

        mql.removeListener = function(listener) {
            for (var i = 0, il = listeners.length; i < il; i++){
                if (listeners[i] === listener){
                    listeners.splice(i, 1);
                }
            }
        };

        return mql;
    };
}());
;// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel

// MIT license

(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());
;var salvattore = (function (global, document, undefined) {
"use strict";

var self = {},
    grids = [],
    add_to_dataset = function(element, key, value) {
      // uses dataset function or a fallback for <ie10
      if (element.dataset) {
        element.dataset[key] = value;
      } else {
        element.setAttribute("data-" + key, value);
      }
      return;
    };

self.obtain_grid_settings = function obtain_grid_settings(element) {
  // returns the number of columns and the classes a column should have,
  // from computing the style of the ::before pseudo-element of the grid.

  var computedStyle = global.getComputedStyle(element, ":before")
    , content = computedStyle.getPropertyValue("content").slice(1, -1)
    , matchResult = content.match(/^\s*(\d+)(?:\s?\.(.+))?\s*$/)
    , numberOfColumns
    , columnClasses
  ;

  if (matchResult) {
    numberOfColumns = matchResult[1];
    columnClasses = matchResult[2];
    columnClasses = columnClasses? columnClasses.split(".") : ["column"];
  } else {
    matchResult = content.match(/^\s*\.(.+)\s+(\d+)\s*$/);
    columnClasses = matchResult[1];
    numberOfColumns = matchResult[2];
    if (numberOfColumns) {
      numberOfColumns = numberOfColumns.split(".");
    }
  }

  return {
    numberOfColumns: numberOfColumns,
    columnClasses: columnClasses
  };
};


self.add_columns = function add_columns(grid, items) {
  // from the settings obtained, it creates columns with
  // the configured classes and adds to them a list of items.

  var settings = self.obtain_grid_settings(grid)
    , numberOfColumns = settings.numberOfColumns
    , columnClasses = settings.columnClasses
    , columnsItems = new Array(+numberOfColumns)
    , columnsFragment = document.createDocumentFragment()
    , i = numberOfColumns
    , selector
  ;

  while (i-- !== 0) {
    selector = "[data-columns] > *:nth-child(" + numberOfColumns + "n-" + i + ")";
    columnsItems.push(items.querySelectorAll(selector));
  }

  columnsItems.forEach(function append_to_grid_fragment(rows) {
    var column = document.createElement("div")
      , rowsFragment = document.createDocumentFragment()
    ;

    column.className = columnClasses.join(" ");

    Array.prototype.forEach.call(rows, function append_to_column(row) {
      rowsFragment.appendChild(row);
    });
    column.appendChild(rowsFragment);
    columnsFragment.appendChild(column);
  });

  grid.appendChild(columnsFragment);
  add_to_dataset(grid, 'columns', numberOfColumns);
};


self.remove_columns = function remove_columns(grid) {
  // removes all the columns from a grid, and returns a list
  // of items sorted by the ordering of columns.

  var range = document.createRange();
  range.selectNodeContents(grid);

  var columns = Array.prototype.filter.call(range.extractContents().childNodes, function filter_elements(node) {
    return node instanceof global.HTMLElement;
  });

  var numberOfColumns = columns.length
    , numberOfRowsInFirstColumn = columns[0].childNodes.length
    , sortedRows = new Array(numberOfRowsInFirstColumn * numberOfColumns)
  ;

  Array.prototype.forEach.call(columns, function iterate_columns(column, columnIndex) {
    Array.prototype.forEach.call(column.children, function iterate_rows(row, rowIndex) {
      sortedRows[rowIndex * numberOfColumns + columnIndex] = row;
    });
  });

  var container = document.createElement("div");
  add_to_dataset(container, 'columns', 0);

  sortedRows.filter(function filter_non_null(child) {
    return !!child;
  }).forEach(function append_row(child) {
    container.appendChild(child);
  });

  return container;
};


self.recreate_columns = function recreate_columns(grid) {
  // removes all the columns from the grid, and adds them again,
  // it is used when the number of columns change.

  global.requestAnimationFrame(function render_after_css_media_query_change() {
    self.add_columns(grid, self.remove_columns(grid));
  });
};


self.media_query_change = function media_query_change(mql) {
  // recreates the columns when a media query matches the current state
  // of the browser.

  if (mql.matches) {
    Array.prototype.forEach.call(grids, self.recreate_columns);
  }
};


self.get_css_rules = function get_css_rules(stylesheet) {
  // returns a list of css rules from a stylesheet

  var cssRules;
  try {
    cssRules = stylesheet.sheet.cssRules || stylesheet.sheet.rules;
  } catch (e) {
    return [];
  }

  return cssRules || [];
};


self.get_stylesheets = function get_stylesheets() {
  // returns a list of all the styles in the document (that are accessible).

  return Array.prototype.concat.call(
    Array.prototype.slice.call(document.querySelectorAll("style[type='text/css']")),
    Array.prototype.slice.call(document.querySelectorAll("link[rel='stylesheet']"))
  );
};


self.media_rule_has_columns_selector = function media_rule_has_columns_selector(rules) {
  // checks if a media query css rule has in its contents a selector that
  // styles the grid.

  var i = rules.length
    , rule
  ;

  while (i--) {
    rule = rules[i];
    if (rule.selectorText && rule.selectorText.match(/\[data-columns\](.*)::?before$/)) {
      return true;
    }
  }

  return false;
};


self.scan_media_queries = function scan_media_queries() {
  // scans all the stylesheets for selectors that style grids,
  // if the matchMedia API is supported.

  var mediaQueries = [];

  if (!global.matchMedia) {
    return;
  }

  self.get_stylesheets().forEach(function extract_rules(stylesheet) {
    Array.prototype.forEach.call(self.get_css_rules(stylesheet), function filter_by_column_selector(rule) {
      if (rule.media && self.media_rule_has_columns_selector(rule.cssRules)) {
        mediaQueries.push(global.matchMedia(rule.media.mediaText));
      }
    });
  });

  mediaQueries.forEach(function listen_to_changes(mql) {
    mql.addListener(self.media_query_change);
  });
};


self.next_element_column_index = function next_element_column_index(grid) {
  // returns the index of the column where the given element must be added.

  var children = grid.children
    , m = children.length
    , highestRowCount
    , child
    , currentRowCount
    , i = children.length - 1
  ;

  for (i; i >= 0; i--) {
    child = children[i];
    currentRowCount = child.children.length;
    if (i !== 0 && highestRowCount > currentRowCount) {
      break;
    } else if (i + 1 === m) {
      i = 0;
      break;
    }

    highestRowCount = currentRowCount;
  }

  return i;
};


self.create_list_of_fragments = function create_list_of_fragments(quantity) {
  // returns a list of fragments

  var fragments = new Array(quantity)
    , i = 0
  ;

  while (i !== quantity) {
    fragments[i] = document.createDocumentFragment();
    i++;
  }

  return fragments;
};


self.append_elements = function append_elements(grid, elements) {
  // adds a list of elements to the end of a grid

  var columns = grid.children
    , numberOfColumns = columns.length
    , fragments = self.create_list_of_fragments(numberOfColumns)
    , columnIndex = self.next_element_column_index(grid)
  ;

  elements.forEach(function append_to_next_fragment(element) {
    fragments[columnIndex].appendChild(element);
    if (columnIndex === numberOfColumns - 1) {
      columnIndex = 0;
    } else {
      columnIndex++;
    }
  });

  Array.prototype.forEach.call(columns, function insert_column(column, index) {
    column.appendChild(fragments[index]);
  });
};


self.prepend_elements = function prepend_elements(grid, elements) {
  // adds a list of elements to the start of a grid

  var columns = grid.children
    , numberOfColumns = columns.length
    , fragments = self.create_list_of_fragments(numberOfColumns)
    , columnIndex = numberOfColumns - 1
  ;

  elements.forEach(function append_to_next_fragment(element) {
    var fragment = fragments[columnIndex];
    fragment.insertBefore(element, fragment.firstChild);
    if (columnIndex === 0) {
      columnIndex = numberOfColumns - 1;
    } else {
      columnIndex--;
    }
  });

  Array.prototype.forEach.call(columns, function insert_column(column, index) {
    column.insertBefore(fragments[index], column.firstChild);
  });

  // populates a fragment with n columns till the right
  var fragment = document.createDocumentFragment()
    , numberOfColumnsToExtract = elements.length % numberOfColumns
  ;

  while (numberOfColumnsToExtract-- !== 0) {
    fragment.appendChild(grid.lastChild);
  }

  // adds the fragment to the left
  grid.insertBefore(fragment, grid.firstChild);
};


self.register_grid = function register_grid (grid) {
  if (global.getComputedStyle(grid).display === "none") {
    return;
  }

  // retrieve the list of items from the grid itself
  var range = document.createRange();
  range.selectNodeContents(grid);

  var items = document.createElement("div");
  items.appendChild(range.extractContents());


  add_to_dataset(items, 'columns', 0);
  self.add_columns(grid, items);
  grids.push(grid);
};


self.init = function init() {
  // scans all the grids in the document and generates
  // columns from their configuration.

  var gridElements = document.querySelectorAll("[data-columns]");
  Array.prototype.forEach.call(gridElements, self.register_grid);
  self.scan_media_queries();
};


self.init();

return {
  append_elements: self.append_elements,
  prepend_elements: self.prepend_elements,
  register_grid: self.register_grid
};

})(window, window.document);

    return salvattore;
}));
// Generated by CoffeeScript 1.6.2
/*
jQuery Waypoints - v2.0.3
Copyright (c) 2011-2013 Caleb Troughton
Dual licensed under the MIT license and GPL license.
https://github.com/imakewebthings/jquery-waypoints/blob/master/licenses.txt
*/
(function(){var t=[].indexOf||function(t){for(var e=0,n=this.length;e<n;e++){if(e in this&&this[e]===t)return e}return-1},e=[].slice;(function(t,e){if(typeof define==="function"&&define.amd){return define("waypoints",["jquery"],function(n){return e(n,t)})}else{return e(t.jQuery,t)}})(this,function(n,r){var i,o,l,s,f,u,a,c,h,d,p,y,v,w,g,m;i=n(r);c=t.call(r,"ontouchstart")>=0;s={horizontal:{},vertical:{}};f=1;a={};u="waypoints-context-id";p="resize.waypoints";y="scroll.waypoints";v=1;w="waypoints-waypoint-ids";g="waypoint";m="waypoints";o=function(){function t(t){var e=this;this.$element=t;this.element=t[0];this.didResize=false;this.didScroll=false;this.id="context"+f++;this.oldScroll={x:t.scrollLeft(),y:t.scrollTop()};this.waypoints={horizontal:{},vertical:{}};t.data(u,this.id);a[this.id]=this;t.bind(y,function(){var t;if(!(e.didScroll||c)){e.didScroll=true;t=function(){e.doScroll();return e.didScroll=false};return r.setTimeout(t,n[m].settings.scrollThrottle)}});t.bind(p,function(){var t;if(!e.didResize){e.didResize=true;t=function(){n[m]("refresh");return e.didResize=false};return r.setTimeout(t,n[m].settings.resizeThrottle)}})}t.prototype.doScroll=function(){var t,e=this;t={horizontal:{newScroll:this.$element.scrollLeft(),oldScroll:this.oldScroll.x,forward:"right",backward:"left"},vertical:{newScroll:this.$element.scrollTop(),oldScroll:this.oldScroll.y,forward:"down",backward:"up"}};if(c&&(!t.vertical.oldScroll||!t.vertical.newScroll)){n[m]("refresh")}n.each(t,function(t,r){var i,o,l;l=[];o=r.newScroll>r.oldScroll;i=o?r.forward:r.backward;n.each(e.waypoints[t],function(t,e){var n,i;if(r.oldScroll<(n=e.offset)&&n<=r.newScroll){return l.push(e)}else if(r.newScroll<(i=e.offset)&&i<=r.oldScroll){return l.push(e)}});l.sort(function(t,e){return t.offset-e.offset});if(!o){l.reverse()}return n.each(l,function(t,e){if(e.options.continuous||t===l.length-1){return e.trigger([i])}})});return this.oldScroll={x:t.horizontal.newScroll,y:t.vertical.newScroll}};t.prototype.refresh=function(){var t,e,r,i=this;r=n.isWindow(this.element);e=this.$element.offset();this.doScroll();t={horizontal:{contextOffset:r?0:e.left,contextScroll:r?0:this.oldScroll.x,contextDimension:this.$element.width(),oldScroll:this.oldScroll.x,forward:"right",backward:"left",offsetProp:"left"},vertical:{contextOffset:r?0:e.top,contextScroll:r?0:this.oldScroll.y,contextDimension:r?n[m]("viewportHeight"):this.$element.height(),oldScroll:this.oldScroll.y,forward:"down",backward:"up",offsetProp:"top"}};return n.each(t,function(t,e){return n.each(i.waypoints[t],function(t,r){var i,o,l,s,f;i=r.options.offset;l=r.offset;o=n.isWindow(r.element)?0:r.$element.offset()[e.offsetProp];if(n.isFunction(i)){i=i.apply(r.element)}else if(typeof i==="string"){i=parseFloat(i);if(r.options.offset.indexOf("%")>-1){i=Math.ceil(e.contextDimension*i/100)}}r.offset=o-e.contextOffset+e.contextScroll-i;if(r.options.onlyOnScroll&&l!=null||!r.enabled){return}if(l!==null&&l<(s=e.oldScroll)&&s<=r.offset){return r.trigger([e.backward])}else if(l!==null&&l>(f=e.oldScroll)&&f>=r.offset){return r.trigger([e.forward])}else if(l===null&&e.oldScroll>=r.offset){return r.trigger([e.forward])}})})};t.prototype.checkEmpty=function(){if(n.isEmptyObject(this.waypoints.horizontal)&&n.isEmptyObject(this.waypoints.vertical)){this.$element.unbind([p,y].join(" "));return delete a[this.id]}};return t}();l=function(){function t(t,e,r){var i,o;r=n.extend({},n.fn[g].defaults,r);if(r.offset==="bottom-in-view"){r.offset=function(){var t;t=n[m]("viewportHeight");if(!n.isWindow(e.element)){t=e.$element.height()}return t-n(this).outerHeight()}}this.$element=t;this.element=t[0];this.axis=r.horizontal?"horizontal":"vertical";this.callback=r.handler;this.context=e;this.enabled=r.enabled;this.id="waypoints"+v++;this.offset=null;this.options=r;e.waypoints[this.axis][this.id]=this;s[this.axis][this.id]=this;i=(o=t.data(w))!=null?o:[];i.push(this.id);t.data(w,i)}t.prototype.trigger=function(t){if(!this.enabled){return}if(this.callback!=null){this.callback.apply(this.element,t)}if(this.options.triggerOnce){return this.destroy()}};t.prototype.disable=function(){return this.enabled=false};t.prototype.enable=function(){this.context.refresh();return this.enabled=true};t.prototype.destroy=function(){delete s[this.axis][this.id];delete this.context.waypoints[this.axis][this.id];return this.context.checkEmpty()};t.getWaypointsByElement=function(t){var e,r;r=n(t).data(w);if(!r){return[]}e=n.extend({},s.horizontal,s.vertical);return n.map(r,function(t){return e[t]})};return t}();d={init:function(t,e){var r;if(e==null){e={}}if((r=e.handler)==null){e.handler=t}this.each(function(){var t,r,i,s;t=n(this);i=(s=e.context)!=null?s:n.fn[g].defaults.context;if(!n.isWindow(i)){i=t.closest(i)}i=n(i);r=a[i.data(u)];if(!r){r=new o(i)}return new l(t,r,e)});n[m]("refresh");return this},disable:function(){return d._invoke(this,"disable")},enable:function(){return d._invoke(this,"enable")},destroy:function(){return d._invoke(this,"destroy")},prev:function(t,e){return d._traverse.call(this,t,e,function(t,e,n){if(e>0){return t.push(n[e-1])}})},next:function(t,e){return d._traverse.call(this,t,e,function(t,e,n){if(e<n.length-1){return t.push(n[e+1])}})},_traverse:function(t,e,i){var o,l;if(t==null){t="vertical"}if(e==null){e=r}l=h.aggregate(e);o=[];this.each(function(){var e;e=n.inArray(this,l[t]);return i(o,e,l[t])});return this.pushStack(o)},_invoke:function(t,e){t.each(function(){var t;t=l.getWaypointsByElement(this);return n.each(t,function(t,n){n[e]();return true})});return this}};n.fn[g]=function(){var t,r;r=arguments[0],t=2<=arguments.length?e.call(arguments,1):[];if(d[r]){return d[r].apply(this,t)}else if(n.isFunction(r)){return d.init.apply(this,arguments)}else if(n.isPlainObject(r)){return d.init.apply(this,[null,r])}else if(!r){return n.error("jQuery Waypoints needs a callback function or handler option.")}else{return n.error("The "+r+" method does not exist in jQuery Waypoints.")}};n.fn[g].defaults={context:r,continuous:true,enabled:true,horizontal:false,offset:0,triggerOnce:false};h={refresh:function(){return n.each(a,function(t,e){return e.refresh()})},viewportHeight:function(){var t;return(t=r.innerHeight)!=null?t:i.height()},aggregate:function(t){var e,r,i;e=s;if(t){e=(i=a[n(t).data(u)])!=null?i.waypoints:void 0}if(!e){return[]}r={horizontal:[],vertical:[]};n.each(r,function(t,i){n.each(e[t],function(t,e){return i.push(e)});i.sort(function(t,e){return t.offset-e.offset});r[t]=n.map(i,function(t){return t.element});return r[t]=n.unique(r[t])});return r},above:function(t){if(t==null){t=r}return h._filter(t,"vertical",function(t,e){return e.offset<=t.oldScroll.y})},below:function(t){if(t==null){t=r}return h._filter(t,"vertical",function(t,e){return e.offset>t.oldScroll.y})},left:function(t){if(t==null){t=r}return h._filter(t,"horizontal",function(t,e){return e.offset<=t.oldScroll.x})},right:function(t){if(t==null){t=r}return h._filter(t,"horizontal",function(t,e){return e.offset>t.oldScroll.x})},enable:function(){return h._invoke("enable")},disable:function(){return h._invoke("disable")},destroy:function(){return h._invoke("destroy")},extendFn:function(t,e){return d[t]=e},_invoke:function(t){var e;e=n.extend({},s.vertical,s.horizontal);return n.each(e,function(e,n){n[t]();return true})},_filter:function(t,e,r){var i,o;i=a[n(t).data(u)];if(!i){return[]}o=[];n.each(i.waypoints[e],function(t,e){if(r(i,e)){return o.push(e)}});o.sort(function(t,e){return t.offset-e.offset});return n.map(o,function(t){return t.element})}};n[m]=function(){var t,n;n=arguments[0],t=2<=arguments.length?e.call(arguments,1):[];if(h[n]){return h[n].apply(null,t)}else{return h.aggregate.call(null,n)}};n[m].settings={resizeThrottle:100,scrollThrottle:30};return i.load(function(){return n[m]("refresh")})})}).call(this);

/*********************************************************************
*  #### Twitter Post Fetcher v10.0 ####
*  Coded by Jason Mayes 2013. A present to all the developers out there.
*  www.jasonmayes.com
*  Please keep this disclaimer with my code if you use it. Thanks. :-)
*  Got feedback or questions, ask here: 
*  http://www.jasonmayes.com/projects/twitterApi/
*  Updates will be posted to this site.
*********************************************************************/
var twitterFetcher=function(){function x(e){return e.replace(/<b[^>]*>(.*?)<\/b>/gi,function(c,e){return e}).replace(/class=".*?"|data-query-source=".*?"|dir=".*?"|rel=".*?"/gi,"")}function p(e,c){for(var g=[],f=RegExp("(^| )"+c+"( |$)"),a=e.getElementsByTagName("*"),h=0,d=a.length;h<d;h++)f.test(a[h].className)&&g.push(a[h]);return g}var y="",l=20,s=!0,k=[],t=!1,q=!0,r=!0,u=null,v=!0,z=!0,w=null,A=!0;return{fetch:function(e,c,g,f,a,h,d,b,m,n){void 0===g&&(g=20);void 0===f&&(s=!0);void 0===a&&(a=
!0);void 0===h&&(h=!0);void 0===d&&(d="default");void 0===b&&(b=!0);void 0===m&&(m=null);void 0===n&&(n=!0);t?k.push({id:e,domId:c,maxTweets:g,enableLinks:f,showUser:a,showTime:h,dateFunction:d,showRt:b,customCallback:m,showInteraction:n}):(t=!0,y=c,l=g,s=f,r=a,q=h,z=b,u=d,w=m,A=n,c=document.createElement("script"),c.type="text/javascript",c.src="//cdn.syndication.twimg.com/widgets/timelines/"+e+"?&lang=en&callback=twitterFetcher.callback&suppress_response_codes=true&rnd="+Math.random(),document.getElementsByTagName("head")[0].appendChild(c))},
callback:function(e){var c=document.createElement("div");c.innerHTML=e.body;"undefined"===typeof c.getElementsByClassName&&(v=!1);e=[];var g=[],f=[],a=[],h=[],d=0;if(v)for(c=c.getElementsByClassName("tweet");d<c.length;){0<c[d].getElementsByClassName("retweet-credit").length?a.push(!0):a.push(!1);if(!a[d]||a[d]&&z)e.push(c[d].getElementsByClassName("e-entry-title")[0]),h.push(c[d].getAttribute("data-tweet-id")),g.push(c[d].getElementsByClassName("p-author")[0]),f.push(c[d].getElementsByClassName("dt-updated")[0]);
d++}else for(c=p(c,"tweet");d<c.length;)e.push(p(c[d],"e-entry-title")[0]),h.push(c[d].getAttribute("data-tweet-id")),g.push(p(c[d],"p-author")[0]),f.push(p(c[d],"dt-updated")[0]),0<p(c[d],"retweet-credit").length?a.push(!0):a.push(!1),d++;e.length>l&&(e.splice(l,e.length-l),g.splice(l,g.length-l),f.splice(l,f.length-l),a.splice(l,a.length-l));c=[];d=e.length;for(a=0;a<d;){if("string"!==typeof u){var b=new Date(f[a].getAttribute("datetime").replace(/-/g,"/").replace("T"," ").split("+")[0]),b=u(b);
f[a].setAttribute("aria-label",b);if(e[a].innerText)if(v)f[a].innerText=b;else{var m=document.createElement("p"),n=document.createTextNode(b);m.appendChild(n);m.setAttribute("aria-label",b);f[a]=m}else f[a].textContent=b}b="";s?(r&&(b+='<div class="user">'+x(g[a].innerHTML)+"</div>"),b+='<p class="tweet">'+x(e[a].innerHTML)+"</p>",q&&(b+='<p class="timePosted">'+f[a].getAttribute("aria-label")+"</p>")):e[a].innerText?(r&&(b+='<p class="user">'+g[a].innerText+"</p>"),b+='<p class="tweet">'+e[a].innerText+
"</p>",q&&(b+='<p class="timePosted">'+f[a].innerText+"</p>")):(r&&(b+='<p class="user">'+g[a].textContent+"</p>"),b+='<p class="tweet">'+e[a].textContent+"</p>",q&&(b+='<p class="timePosted">'+f[a].textContent+"</p>"));A&&(b+='<p class="interact"><a href="https://twitter.com/intent/tweet?in_reply_to='+h[a]+'" class="twitter_reply_icon">Reply</a><a href="https://twitter.com/intent/retweet?tweet_id='+h[a]+'" class="twitter_retweet_icon">Retweet</a><a href="https://twitter.com/intent/favorite?tweet_id='+
h[a]+'" class="twitter_fav_icon">Favorite</a></p>');c.push(b);a++}if(null==w){e=c.length;g=0;f=document.getElementById(y);for(h="<ul>";g<e;)h+="<li>"+c[g]+"</li>",g++;f.innerHTML=h+"</ul>"}else w(c);t=!1;0<k.length&&(twitterFetcher.fetch(k[0].id,k[0].domId,k[0].maxTweets,k[0].enableLinks,k[0].showUser,k[0].showTime,k[0].dateFunction,k[0].showRt,k[0].customCallback,k[0].showInteraction),k.splice(0,1))}}}();

/**
 * Prism: Lightweight, robust, elegant syntax highlighting
 * MIT license http://www.opensource.org/licenses/mit-license.php/
 * @author Lea Verou http://lea.verou.me
 */(function(){var e=/\blang(?:uage)?-(?!\*)(\w+)\b/i,t=self.Prism={util:{type:function(e){return Object.prototype.toString.call(e).match(/\[object (\w+)\]/)[1]},clone:function(e){var n=t.util.type(e);switch(n){case"Object":var r={};for(var i in e)e.hasOwnProperty(i)&&(r[i]=t.util.clone(e[i]));return r;case"Array":return e.slice()}return e}},languages:{extend:function(e,n){var r=t.util.clone(t.languages[e]);for(var i in n)r[i]=n[i];return r},insertBefore:function(e,n,r,i){i=i||t.languages;var s=i[e],o={};for(var u in s)if(s.hasOwnProperty(u)){if(u==n)for(var a in r)r.hasOwnProperty(a)&&(o[a]=r[a]);o[u]=s[u]}return i[e]=o},DFS:function(e,n){for(var r in e){n.call(e,r,e[r]);t.util.type(e)==="Object"&&t.languages.DFS(e[r],n)}}},highlightAll:function(e,n){var r=document.querySelectorAll('code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code');for(var i=0,s;s=r[i++];)t.highlightElement(s,e===!0,n)},highlightElement:function(r,i,s){var o,u,a=r;while(a&&!e.test(a.className))a=a.parentNode;if(a){o=(a.className.match(e)||[,""])[1];u=t.languages[o]}if(!u)return;r.className=r.className.replace(e,"").replace(/\s+/g," ")+" language-"+o;a=r.parentNode;/pre/i.test(a.nodeName)&&(a.className=a.className.replace(e,"").replace(/\s+/g," ")+" language-"+o);var f=r.textContent;if(!f)return;f=f.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/\u00a0/g," ");var l={element:r,language:o,grammar:u,code:f};t.hooks.run("before-highlight",l);if(i&&self.Worker){var c=new Worker(t.filename);c.onmessage=function(e){l.highlightedCode=n.stringify(JSON.parse(e.data),o);t.hooks.run("before-insert",l);l.element.innerHTML=l.highlightedCode;s&&s.call(l.element);t.hooks.run("after-highlight",l)};c.postMessage(JSON.stringify({language:l.language,code:l.code}))}else{l.highlightedCode=t.highlight(l.code,l.grammar,l.language);t.hooks.run("before-insert",l);l.element.innerHTML=l.highlightedCode;s&&s.call(r);t.hooks.run("after-highlight",l)}},highlight:function(e,r,i){return n.stringify(t.tokenize(e,r),i)},tokenize:function(e,n,r){var i=t.Token,s=[e],o=n.rest;if(o){for(var u in o)n[u]=o[u];delete n.rest}e:for(var u in n){if(!n.hasOwnProperty(u)||!n[u])continue;var a=n[u],f=a.inside,l=!!a.lookbehind,c=0;a=a.pattern||a;for(var h=0;h<s.length;h++){var p=s[h];if(s.length>e.length)break e;if(p instanceof i)continue;a.lastIndex=0;var d=a.exec(p);if(d){l&&(c=d[1].length);var v=d.index-1+c,d=d[0].slice(c),m=d.length,g=v+m,y=p.slice(0,v+1),b=p.slice(g+1),w=[h,1];y&&w.push(y);var E=new i(u,f?t.tokenize(d,f):d);w.push(E);b&&w.push(b);Array.prototype.splice.apply(s,w)}}}return s},hooks:{all:{},add:function(e,n){var r=t.hooks.all;r[e]=r[e]||[];r[e].push(n)},run:function(e,n){var r=t.hooks.all[e];if(!r||!r.length)return;for(var i=0,s;s=r[i++];)s(n)}}},n=t.Token=function(e,t){this.type=e;this.content=t};n.stringify=function(e,r,i){if(typeof e=="string")return e;if(Object.prototype.toString.call(e)=="[object Array]")return e.map(function(t){return n.stringify(t,r,e)}).join("");var s={type:e.type,content:n.stringify(e.content,r,i),tag:"span",classes:["token",e.type],attributes:{},language:r,parent:i};s.type=="comment"&&(s.attributes.spellcheck="true");t.hooks.run("wrap",s);var o="";for(var u in s.attributes)o+=u+'="'+(s.attributes[u]||"")+'"';return"<"+s.tag+' class="'+s.classes.join(" ")+'" '+o+">"+s.content+"</"+s.tag+">"};if(!self.document){self.addEventListener("message",function(e){var n=JSON.parse(e.data),r=n.language,i=n.code;self.postMessage(JSON.stringify(t.tokenize(i,t.languages[r])));self.close()},!1);return}var r=document.getElementsByTagName("script");r=r[r.length-1];if(r){t.filename=r.src;document.addEventListener&&!r.hasAttribute("data-manual")&&document.addEventListener("DOMContentLoaded",t.highlightAll)}})();;
Prism.languages.markup={comment:/&lt;!--[\w\W]*?-->/g,prolog:/&lt;\?.+?\?>/,doctype:/&lt;!DOCTYPE.+?>/,cdata:/&lt;!\[CDATA\[[\w\W]*?]]>/i,tag:{pattern:/&lt;\/?[\w:-]+\s*(?:\s+[\w:-]+(?:=(?:("|')(\\?[\w\W])*?\1|\w+))?\s*)*\/?>/gi,inside:{tag:{pattern:/^&lt;\/?[\w:-]+/i,inside:{punctuation:/^&lt;\/?/,namespace:/^[\w-]+?:/}},"attr-value":{pattern:/=(?:('|")[\w\W]*?(\1)|[^\s>]+)/gi,inside:{punctuation:/=|>|"/g}},punctuation:/\/?>/g,"attr-name":{pattern:/[\w:-]+/g,inside:{namespace:/^[\w-]+?:/}}}},entity:/&amp;#?[\da-z]{1,8};/gi};Prism.hooks.add("wrap",function(e){e.type==="entity"&&(e.attributes.title=e.content.replace(/&amp;/,"&"))});;
Prism.languages.css={comment:/\/\*[\w\W]*?\*\//g,atrule:{pattern:/@[\w-]+?.*?(;|(?=\s*{))/gi,inside:{punctuation:/[;:]/g}},url:/url\((["']?).*?\1\)/gi,selector:/[^\{\}\s][^\{\};]*(?=\s*\{)/g,property:/(\b|\B)[\w-]+(?=\s*:)/ig,string:/("|')(\\?.)*?\1/g,important:/\B!important\b/gi,ignore:/&(lt|gt|amp);/gi,punctuation:/[\{\};:]/g};Prism.languages.markup&&Prism.languages.insertBefore("markup","tag",{style:{pattern:/(&lt;|<)style[\w\W]*?(>|&gt;)[\w\W]*?(&lt;|<)\/style(>|&gt;)/ig,inside:{tag:{pattern:/(&lt;|<)style[\w\W]*?(>|&gt;)|(&lt;|<)\/style(>|&gt;)/ig,inside:Prism.languages.markup.tag.inside},rest:Prism.languages.css}}});;
Prism.languages.clike={comment:{pattern:/(^|[^\\])(\/\*[\w\W]*?\*\/|(^|[^:])\/\/.*?(\r?\n|$))/g,lookbehind:!0},string:/("|')(\\?.)*?\1/g,"class-name":{pattern:/((?:(?:class|interface|extends|implements|trait|instanceof|new)\s+)|(?:catch\s+\())[a-z0-9_\.\\]+/ig,lookbehind:!0,inside:{punctuation:/(\.|\\)/}},keyword:/\b(if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/g,"boolean":/\b(true|false)\b/g,"function":{pattern:/[a-z0-9_]+\(/ig,inside:{punctuation:/\(/}}, number:/\b-?(0x[\dA-Fa-f]+|\d*\.?\d+([Ee]-?\d+)?)\b/g,operator:/[-+]{1,2}|!|&lt;=?|>=?|={1,3}|(&amp;){1,2}|\|?\||\?|\*|\/|\~|\^|\%/g,ignore:/&(lt|gt|amp);/gi,punctuation:/[{}[\];(),.:]/g};
;
Prism.languages.javascript=Prism.languages.extend("clike",{keyword:/\b(var|let|if|else|while|do|for|return|in|instanceof|function|new|with|typeof|try|throw|catch|finally|null|break|continue)\b/g,number:/\b-?(0x[\dA-Fa-f]+|\d*\.?\d+([Ee]-?\d+)?|NaN|-?Infinity)\b/g});Prism.languages.insertBefore("javascript","keyword",{regex:{pattern:/(^|[^/])\/(?!\/)(\[.+?]|\\.|[^/\r\n])+\/[gim]{0,3}(?=\s*($|[\r\n,.;})]))/g,lookbehind:!0}});Prism.languages.markup&&Prism.languages.insertBefore("markup","tag",{script:{pattern:/(&lt;|<)script[\w\W]*?(>|&gt;)[\w\W]*?(&lt;|<)\/script(>|&gt;)/ig,inside:{tag:{pattern:/(&lt;|<)script[\w\W]*?(>|&gt;)|(&lt;|<)\/script(>|&gt;)/ig,inside:Prism.languages.markup.tag.inside},rest:Prism.languages.javascript}}});
;
Prism.languages.php=Prism.languages.extend("clike",{keyword:/\b(and|or|xor|array|as|break|case|cfunction|class|const|continue|declare|default|die|do|else|elseif|enddeclare|endfor|endforeach|endif|endswitch|endwhile|extends|for|foreach|function|include|include_once|global|if|new|return|static|switch|use|require|require_once|var|while|abstract|interface|public|implements|extends|private|protected|parent|static|throw|null|echo|print|trait|namespace|use|final|yield|goto|instanceof|finally|try|catch)\b/ig, constant:/\b[A-Z0-9_]{2,}\b/g});Prism.languages.insertBefore("php","keyword",{delimiter:/(\?>|&lt;\?php|&lt;\?)/ig,variable:/(\$\w+)\b/ig,"package":{pattern:/(\\|namespace\s+|use\s+)[\w\\]+/g,lookbehind:!0,inside:{punctuation:/\\/}}});Prism.languages.insertBefore("php","operator",{property:{pattern:/(->)[\w]+/g,lookbehind:!0}}); Prism.languages.markup&&(Prism.hooks.add("before-highlight",function(a){"php"===a.language&&(a.tokenStack=[],a.code=a.code.replace(/(?:&lt;\?php|&lt;\?|<\?php|<\?)[\w\W]*?(?:\?&gt;|\?>)/ig,function(b){a.tokenStack.push(b);return"{{{PHP"+a.tokenStack.length+"}}}"}))}),Prism.hooks.add("after-highlight",function(a){if("php"===a.language){for(var b=0,c;c=a.tokenStack[b];b++)a.highlightedCode=a.highlightedCode.replace("{{{PHP"+(b+1)+"}}}",Prism.highlight(c,a.grammar,"php"));a.element.innerHTML=a.highlightedCode}}), Prism.hooks.add("wrap",function(a){"php"===a.language&&"markup"===a.type&&(a.content=a.content.replace(/(\{\{\{PHP[0-9]+\}\}\})/g,'<span class="token php">$1</span>'))}),Prism.languages.insertBefore("php","comment",{markup:{pattern:/(&lt;|<)[^?]\/?(.*?)(>|&gt;)/g,inside:Prism.languages.markup},php:/\{\{\{PHP[0-9]+\}\}\}/g}));;
Prism.languages.scss=Prism.languages.extend("css",{comment:{pattern:/(^|[^\\])(\/\*[\w\W]*?\*\/|\/\/.*?(\r?\n|$))/g,lookbehind:!0},atrule:/@[\w-]+(?=\s+(\(|\{|;))/gi,url:/([-a-z]+-)*url(?=\()/gi,selector:/([^@;\{\}\(\)]?([^@;\{\}\(\)]|&amp;|\#\{\$[-_\w]+\})+)(?=\s*\{(\}|\s|[^\}]+(:|\{)[^\}]+))/gm});Prism.languages.insertBefore("scss","atrule",{keyword:/@(if|else if|else|for|each|while|import|extend|debug|warn|mixin|include|function|return)|(?=@for\s+\$[-_\w]+\s)+from/i});Prism.languages.insertBefore("scss","property",{variable:/((\$[-_\w]+)|(#\{\$[-_\w]+\}))/i});Prism.languages.insertBefore("scss","ignore",{placeholder:/%[-_\w]+/i,statement:/\B!(default|optional)\b/gi,"boolean":/\b(true|false)\b/g,"null":/\b(null)\b/g,operator:/\s+([-+]{1,2}|={1,2}|!=|\|?\||\?|\*|\/|\%)\s+/g});
;


// Main JS file

jQuery(document).ready(function($)	{
	
	$('.nav-btn').click(function()	{
		$('.mobile-nav').toggleClass('active');
		$('.wrapper').toggleClass('nav-open');
	});	

	$(document).ready(function() {
	    $.ajaxSetup({
	        'beforeSend' : function() {
	            $('.ajax-loader').addClass('show');
	        },
	    'complete'   : function() {
	            $('.ajax-loader').removeClass('show');
	        }
	    });
	});	

	$.ajaxSetup({cache:false});		

	$('.progress').waypoint({
		offset: 650,
		triggerOnce: true,
		handler: function() {
	  		$('.progress-bar').removeClass('hidden').addClass('animate');
		}
	});	

    var client_id = '61fd47803f24406b92fe0e18a1f6bc4e';
    var user_id = '18514242';
    var count = 6;
    var url = 'https://api.instagram.com/v1/users/' + user_id + '/media/recent?client_id=' + client_id + '&count=' + count + '&callback=?';

    $.getJSON( url, function(data)   {
        $.each( data.data, function(index, value)	{
        	var img = '<a href="' + value.link + '" class="feed-item" target="_blank">';

        	img += '<img src="' + value.images.low_resolution.url + '" />';
        	img += '</a>';

        	$('.collage').prepend(img);

        });

    });  	
 	
});