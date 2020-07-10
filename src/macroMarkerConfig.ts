import { Logger, ConsoleLogger } from './logger';
import { DataFlags, Flaggable } from './flags';
import CONSTANTS from './constants';

export interface MarkerConfiguration {
    icon?: string,
    tooltip?: string,
    trigger?: string,
    colour?: string
}

export class MacroMarkerConfig {
    constructor(protected logger: Logger, protected html: HTMLElement) { }

    public static init(): void {
        Hooks.on('renderMacroConfig', (_, jhtml, data) => { 
            const macro = game.macros.get(data.entity._id);
            MacroMarkerConfig.renderConfig(jhtml[0], macro);
            return true;
        });
    }
    
    private static async renderConfig(html: HTMLElement, macro: Macro & Flaggable) {
        const logger = new ConsoleLogger();
        const dataFlags = new DataFlags(logger, macro);
        const data: MarkerConfiguration = dataFlags.getData();
        data['module'] = CONSTANTS.module.name;

        const template = await renderTemplate('modules/macro-marker/templates/macro-marker-config.html', data);
        // renderTemplate returns string instead of HTMLElement...
        MacroMarkerConfig.addTab(html, <string><unknown>template);
    }

    private static addTab(html: HTMLElement, template: string) {
        const nav = document.createElement('nav');
        nav.classList.add('tabs');

        const macroNav = document.createElement('a');
        macroNav.classList.add('item', 'active');
        macroNav.setAttribute('data-tab', 'macro');
        macroNav.text = 'Macro';

        const markerNav = document.createElement('a');
        markerNav.classList.add('item');
        markerNav.setAttribute('data-tab', CONSTANTS.module.name);
        markerNav.text = 'Marker';

        nav.append(macroNav, markerNav);

        const content = document.createElement('section');
        content.classList.add('tab-content');
        
        const macroTab = document.createElement('div');
        macroTab.classList.add('tab', 'flexcol');
        macroTab.setAttribute('data-tab', 'macro');

        const macroInputs = html.querySelectorAll('.form-group');
        for(const macroInput of macroInputs) {
            macroTab.appendChild(macroInput);
        }

        const markerTab = document.createElement('div');
        markerTab.classList.add('tab', 'flexcol');
        markerTab.setAttribute('data-tab', CONSTANTS.module.name);
        markerTab.innerHTML = template;

        content.append(macroTab, markerTab);

        html.querySelector('.sheet-header')?.after(nav);
        nav.after(content);

        const tabs = new TabsV2({navSelector: '.tabs', contentSelector: '.tab-content', initial: 'macro', callback: () => { /* */ } });
        tabs.bind(html);

        // TODO: revive file picker v__v
        const icon = <HTMLElement>markerTab.querySelector(`input[name="${CONSTANTS.module.name}.icon"]`);
        const fileBrowser = FilePicker.fromButton(icon, {});
        icon.addEventListener('focus', () => {
            fileBrowser.render(true);
        });
    }
}