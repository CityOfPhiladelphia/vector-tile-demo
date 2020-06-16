var BASE_CONFIG_URL = '//rawgit.com/ajrothwell/marathon-base-config/af047c99136d807021519ff8501fc74b894c14a9/config.js';
var GATEKEEPER_KEY = '60a96cf015063fa0f0e2708bc3c61775';
const webmapId = '4c3ed877199c402895b7fa45ce6409b6';

// configure accounting.js
accounting.settings.currency.precision = 0;

Mapboard.default({
  // DEV
  router: {
    enabled: true
  },
  rootStyle: {
    position: 'absolute',
    bottom: 0,
    // top: '78px',
    top: '118px',
    left: 0,
    right: 0,
  },
  webmapId: WEBMAP_ID,
  map: {
    // possibly should move to base config
    defaultBasemap: 'pwd',
    defaultIdentifyFeature: 'address-marker',
    imagery: {
      enabled: true
    },
    historicBasemaps: {
      enabled: true
    },
    center: [39.982649, -75.188560],
    minZoom: 11,
    maxZoom: 22,
    zoom: 13,
    featureLayers: {
      marathon: {
        url: '//services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/FullMarathon/FeatureServer/0',
        color: 'red',
        fillColor: 'red',
        weight: 10,
        minZoom: 12,
        opacity: 0.2,
      },
      mileMarkers: {
        url: '//services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/FullMiles/FeatureServer/0',
        color: 'blue',
        fillColor: 'blue',
        weight: 1,
        minZoom: 12,
        pointLayer: true
      },
    }
  },
  baseConfig: BASE_CONFIG_URL,

  imageOverlayGroups: {
    regmaps: {
      items: function(state) {
        // console.log('main.js imageOverlayGroups', state)
        return state.sources.regmaps.data;
      }
    }
  },
  legendControls: {
    'water':
      {
        'Roof': '#FEFF7F',
        'Other Impervious Surface': '#F2DCFF'
      }
  },
  cyclomedia: {
    enabled: true
  },
  pictometry: {
    enabled: false
  },
  // reusable transforms for topic data. see `topics` section for usage.
  transforms: {
    currency: {
      // a list of global objects this transform depends on
      globals: ['accounting'],
      // this is the function that gets called to perform the transform
      transform: function(value, globals) {
        var accounting = globals.accounting;
        return accounting.formatMoney(value);
      }
    },
    date: {
      globals: ['moment'],
      transform: function(value, globals) {
        var moment = globals.moment;
        return moment(value).format('MM/DD/YYYY');
      }
    },
    phoneNumber: {
      transform: function(value) {
        var s2 = (""+value).replace(/\D/g, '');
        var m = s2.match(/^(\d{3})(\d{3})(\d{4})$/);
        return (!m) ? null : "(" + m[1] + ") " + m[2] + "-" + m[3];
      }
    },
    rcoPrimaryContact: {
      transform: function(value) {
        var PHONE_NUMBER_PAT = /\(?(\d{3})\)?( |-)?(\d{3})(-| )?(\d{4})/g;
        var m = PHONE_NUMBER_PAT.exec(value);

        // check for non-match
        if (!m) {
          return value;
        }

        // standardize phone number
        var std = ['(', m[1], ') ', m[3], '-', m[5]].join('');
        var orig = m[0]
        var valueStd = value.replace(orig, std);

        return valueStd;
      }
    },
    booleanToYesNo: {
      transform: function(value) {
        return value ? 'Yes' : 'No';
      }
    },
    thousandsPlace: {
      transform: function(value) {
        var number = String(value).match(/\d+/)[0].replace(/(.)(?=(\d{3})+$)/g,'$1,');
        var label = String(value).replace(/[0-9]/g, '') || '';
        return number + ' ' + label;
      }
    }
  },
});
