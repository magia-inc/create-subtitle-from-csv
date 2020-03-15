function createSubtitle(str, inPointFrame, outPointFrame) {
    app.beginUndoGroup('createSubtitle');
    var subtitle = activeComp.layers.addText(str);
    subtitle.inPoint = inPointFrame;
    subtitle.outPoint = outPointFrame;
    app.endUndoGroup();
    return 0;
}

function init() {
    activeComp = app.project.activeItem;
    if (!activeComp) {
        alert('コンポジションが選択されていません');
        return -1;
    }
    return 0
}
