var app_options = {
    'sync_torrents': {
        'default': false,
        'enabled':false,
        'type':'bool',
        'description': 'your list of torrents will be synchronized across your devices'
    },

    'show_notifications': {
        'default':true,
        'type':'bool'
    },

    'default_download_location': {
        'default':null,
        'type':'JSON',
        'description':'where torrents download to'
    },

    'new_torrent_show_dialog': {
        'default': true,
        'type':'bool',
        'description':'whether to show a dialog when adding a new torrent'
    },

    'maxconns': {
        'default': 2,
        'type':'int'
    }
    
}


function Options(opts) {
    this.data = null
    this.app = opts && opts.app
}

jstorrent.Options = Options

Options.prototype = {
    get: function(k) {
        // gets from cached copy, so synchronous
        var val = this.data[k]
        if (val === undefined && app_options[k] && app_options[k]['default']) {
            return app_options[k]['default']
        }
    },
    set: function(k,v) {
        this.data[k] = v
        var obj = {}
        obj[k]=v;
        chrome.storage.local.set(obj)
    },
    load: function(callback) {
        chrome.storage.local.get('options', _.bind(this.options_loaded, this, callback))
    },
    options_loaded: function(callback, data) {
        console.log('options loaded',data);
        this.data = data
        callback()
    },
    on_choose_download_directory: function(entry) {
        var retain_string = chrome.fileSystem.retainEntry(entry);
        console.log('user choose download directory',entry, 'retain string:',retain_string)
        this.set('default_download_location',
                        {retainEntryId: retain_string,
                         name: entry.name,
                         fullPath: entry.fullPath}
                       )
        if (this.app) {
            this.app.download_location = entry
        } else {
            //mainAppWindow.app.download_location = entry
            mainAppWindow.app.set_default_download_location(entry);
        }
    }
}


