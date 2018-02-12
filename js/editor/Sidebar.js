import { Component, render, h } from 'preact';

import { InteractionMode } from './Interaction';

export function renderSidebar(selector, editor) {
    render(<Sidebar editor={editor} />, selector);
}

class Sidebar extends Component {
    componentDidMount() {
        const { editor } = this.props;

        editor.interaction.on('change', () => this.forceUpdate());
        editor.selection.on('change', () => this.forceUpdate());
    }

    render() {
        const { editor } = this.props;
        const mode = editor.interaction.mode;

        return (
            <div>
                <Controls />
                <LevelSelector {...this.props} />
                <Mode {...this.props} />
                {mode === InteractionMode.SELECT && <SelectionMode {...this.props} />}
                {mode === InteractionMode.TILE && <TileMode {...this.props} />}
                {mode === InteractionMode.ENTITY && <EntityMode {...this.props} />}
                <Save {...this.props} />
            </div>
        );
    }
}

function LevelSelector({ editor }) {
    const levels = editor.levelManager.levels;
    const level = levels[editor.levelIdx];

    const onSelect = e => {
        const levelIdx = parseInt(e.target.dataset.idx);
        editor.startEditing(levelIdx);
        editor.pause();
        this.forceUpdate();
    };

    return (
        <div>
            <div>{level.spec.name}</div>
            <div style={{ display: 'flex' }}>
                {levels.map((l, idx) => {
                    if (idx === 0) {
                        return;
                    }
                    const style = {
                        cursor: 'default',
                        padding: '5px 10px',
                        color: editor.levelIdx === idx ? 'black' : 'white',
                        backgroundColor: editor.levelIdx === idx ? 'white' : 'black'
                    };
                    return (
                        <div data-idx={idx} onClick={onSelect} style={style}>
                            {idx}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

class Save extends Component {
    async save() {
        this.success = await this.props.editor.interaction.saveToFile();
        this.forceUpdate();

        setTimeout(() => {
            this.success = undefined;
            this.forceUpdate();
        }, 1000);
    }

    render() {
        const btnStyle = {
            cursor: 'pointer',
            marginRight: 10,
            fontSize: 50
        };

        return (
            <div style={{ marginTop: 50, textAlign: 'center' }}>
                <div style={btnStyle} onClick={this.save.bind(this)}>
                    SAVE
                </div>
                <div>{this.success !== undefined && (this.success ? 'ok' : 'fail')}</div>
            </div>
        );
    }
}

function Controls() {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>Controls:</div>
            <div>
                <div>T - pause/resume</div>
                <div>R - restart</div>
                <div>C-s - save</div>
                <div style={{ 'margin-top': '5px' }}>Q - select mode</div>
                <div>W - tile mode</div>
                <div>E - entity mode</div>
            </div>
        </div>
    );
}

function Mode({ editor: { interaction } }) {
    const modeStyle = selected => ({
        padding: '0px 5px',
        backgroundColor: selected ? 'white' : 'transparent',
        color: selected ? 'black' : 'white',
        cursor: 'default'
    });

    const onClick = mode => () => {
        interaction.setMode(mode);
    };

    const modeLabels = {
        [InteractionMode.SELECT]: 'SELECT',
        [InteractionMode.TILE]: 'TILE',
        [InteractionMode.ENTITY]: 'ENTITY'
    };

    function ModeItem({ mode }) {
        const label = modeLabels[mode];
        return (
            <div onClick={onClick(mode)} style={modeStyle(interaction.mode === mode)}>
                {label}
            </div>
        );
    }

    return (
        <div
            style={{
                display: 'flex',
                'margin-top': '15px',
                'justify-content': 'space-between'
            }}
        >
            <div>mode: </div>
            <div style={{ display: 'flex' }}>
                <ModeItem mode={InteractionMode.SELECT} />
                <ModeItem mode={InteractionMode.TILE} />
                <ModeItem mode={InteractionMode.ENTITY} />
            </div>
        </div>
    );
}

function SelectionMode({ editor: { selection, interaction } }) {
    if (selection.empty) {
        return;
    }

    const tile = selection.selectedTile;
    const entity = selection.selectedEntity;
    const spec = selection.getSpec();

    const type = tile ? 'tile' : 'entity';
    const pos = tile
        ? `[${tile.indexX}, ${tile.indexY}], [${tile.x1}, ${tile.y1}]`
        : `[${entity.pos.x}, ${entity.pos.y}]`;

    return (
        <div
            style={{ display: 'flex', 'margin-top': '15px', 'flex-direction': 'column' }}
        >
            <div style={{ display: 'flex' }}>
                <div style={{ marginRight: '10px' }}>Selection:</div>
                <span>
                    {type} {pos}
                </span>
            </div>
            <div style={{ display: 'flex', marginTop: 10 }}>
                <Spec spec={{ ...spec }} />
            </div>
        </div>
    );
}

function Spec({ spec }) {
    const keys = Object.keys(spec);

    const rows = keys.map(key => {
        const value = spec[key];
        return [<div>{key}: </div>, <div>{value}</div>];
    });

    const table = (
        <div style={{ display: 'grid', 'grid-template-columns': 'repeat(2, 1fr)' }}>
            {rows}
        </div>
    );

    return <div>{table}</div>;
}

function TileMode({ editor }) {
    const interaction = editor.interaction;
    const tileSkinNames = editor.levelSpec.tileSprite.frames.map(f => f.name);

    function onSelect(e) {
        const value = e.target.value;
        interaction.setCreateTileSkin(value);
    }

    if (!interaction.createTileSkin) {
        interaction.setCreateTileSkin(tileSkinNames[0]);
    }

    return (
        <div style={{ display: 'flex', marginTop: '15px', 'flex-direction': 'column' }}>
            <select onChange={onSelect} style={{ 'min-height': '150px' }} size="3">
                {tileSkinNames.map((name, idx) => (
                    <option
                        selected={name === interaction.setCreateTileSkin}
                        value={name}
                    >
                        {name}
                    </option>
                ))}
            </select>
        </div>
    );
}

function EntityMode({ editor: { entityFactory, interaction } }) {
    const nameSkinCombs = Object.keys(entityFactory).reduce((acc, name) => {
        const skins = entityFactory[name].availableSkins;
        skins.forEach(skin => acc.push({ name, skin }));
        return acc;
    }, []);

    function onSelect(e) {
        const idx = e.target.value;
        const { skin, name } = nameSkinCombs[idx];

        interaction.setCreateEntityName(name);
        interaction.setCreateEntitySkinName(skin);
    }

    function isSelected(name, skin) {
        return (
            interaction.createEntityName === name &&
            interaction.createEntitySkinName === skin
        );
    }

    if (!interaction.createEntityName) {
        const { skin, name } = nameSkinCombs[0];

        interaction.setCreateEntityName(name);
        interaction.setCreateEntitySkinName(skin);
    }

    return (
        <div style={{ display: 'flex', marginTop: '15px', 'flex-direction': 'column' }}>
            <select onChange={onSelect} style={{ 'min-height': '150px' }} size="3">
                {nameSkinCombs.map(({ name, skin }, idx) => (
                    <option selected={isSelected(name, skin)} value={idx}>
                        {name} {skin !== 'default' && `[${skin}]`}
                    </option>
                ))}
            </select>
        </div>
    );
}
