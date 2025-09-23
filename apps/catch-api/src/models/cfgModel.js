export class Cfg {
    constructor({ cfg_capture_state, cfg_sync_state, cfg_sync_interval, cfg_check_interval, cfg_apikey}) {
        this.cfg_capture_state = cfg_capture_state;
        this.cfg_sync_state = cfg_sync_state;
        this.cfg_sync_interval = cfg_sync_interval;
        this.cfg_check_interval = cfg_check_interval;
        this.cfg_apikey = cfg_apikey;
    }
}