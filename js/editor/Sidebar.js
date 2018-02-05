import { render, h } from 'preact';

import { InteractionMode } from './Interaction';

export function renderSidebar(selector, editor) {
    render(<Sidebar editor={editor} />, selector);
}

function Sidebar({ editor }) {
    return (
        <div>
            <Controls />
            <Mode interaction={editor.interaction} />
            <Selection selection={editor.selection} />
        </div>
    )
}

function Controls() {
    return (
        <div style={{ display: 'flex' }}>
            <div style={{ flex: 1 }}>Controls:</div>
            <div>
                <div>T - pause/resume</div>
                <div>R - restart</div>
            </div>
        </div>
    )
}

function Mode({ interaction }) {
    const modeStyle = (selected) => ({
        padding: '0px 5px',
        backgroundColor: selected ? 'white' : 'transparent',
        color: selected ? 'black' : 'white',
        cursor: 'default'
    });

    const onClick = (mode) => () => {
        interaction.setMode(mode);
        this.forceUpdate();
    }

    const modeLabels = {
        [InteractionMode.SELECT]: 'SELECT',
        [InteractionMode.TILE]: 'TILE',
        [InteractionMode.ENTITY]: 'ENTITY'
    };

    function ModeItem({ mode }) {
        const label = modeLabels[mode];
        return <div onClick={onClick(mode)} style={modeStyle(interaction.mode === mode)}>{label}</div>
    }

    return (
        <div style={{ display: 'flex', marginTop: '15px' }}>
            <div style={{ marginRight: '5px' }}>mode: </div>
            <div style={{ display: 'flex' }}>
                <ModeItem mode={InteractionMode.SELECT} />
                <ModeItem mode={InteractionMode.TILE} />
                <ModeItem mode={InteractionMode.ENTITY} />
            </div>
        </div>
    )
}

function Selection({ selection }) {
    selection.onChange(() => this.forceUpdate());

    if (selection.empty) {
        return;
    }

    const tile = selection.selectedTile;
    const entity = selection.selectedEntity;
    const spec = selection.getSpec();

    const type = tile ? 'tile' : 'entity';
    const pos = tile ? `[${tile.indexX}, ${tile.indexY}]` : `[${entity.pos.x}, ${entity.pos.y}]`;

    return (
        <div style={{ display: 'flex', marginTop: '15px', 'flex-direction': 'column' }}>
            <div style={{ display: 'flex' }}>
                <div style={{ marginRight: '10px' }}>Selection:</div>
                <span>{type} {pos}</span>
            </div>
            <div style={{ display: 'flex' }}>
                <Spec spec={{...spec}} />
            </div>
        </div>
    )
}

function Spec({ spec }) {
    const keys = Object.keys(spec);

    const rows = keys.map(key => {
        const value = spec[key];

        return (
            <tr>
                <td>{key}: </td>
                <td>{value}</td>
            </tr>
        )
    });

    const table = <table>{rows}</table>

    return (
        <div>
            {table}
        </div>
    )
}
