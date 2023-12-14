const parse = input => input.map(str => str.split(''))

class Panel {
    constructor(rows) {
        this.rows = rows;
        this.ldi = Array.from({length: this.rows.length}).map((_, i) => i);
        this.lri = Array.from({length: this.rows.length}).map((_, i) => this.rows.length - i - 1);
        this.cdi = Array.from({length: this.rows[0].length}).map((_, i) => i);
        this.cri = Array.from({length: this.rows[0].length}).map((_, i) => this.rows[0].length - i - 1);
    }

    key = () => this.rows.map(row => row.join('')).join('\n');

    value = () => this.rows
        .map((row, i) => row.filter(v => v === 'O').length * (this.rows.length - i))
        .reduce((acc, v) => acc + v, 0);

    tilt = (horizontal, reverse) => {
        const data = {};
        (horizontal || !reverse ? this.ldi : this.lri).forEach(i =>
            (!horizontal || !reverse ? this.cdi : this.cri).forEach(j => {
                const v = this.rows[i][j];
                if (v === '.') {
                    return;
                }
                if (v === '#') {
                    data[horizontal ? i : j] = (horizontal ? j : i)
                    return;
                }
                const pos = data[horizontal ? i : j] = (data[horizontal ? i : j] ?? (reverse ? (horizontal ? this.rows[i].length : this.rows.length) : -1)) + (reverse ? -1 : +1);
                const v1 = this.rows[i][j];
                if (horizontal) {
                    this.rows[i][j] = this.rows[i][pos];
                    this.rows[i][pos] = v1;
                } else {
                    this.rows[i][j] = this.rows[pos][j];
                    this.rows[pos][j] = v1;
                }
            }))
        return this;
    };

    tiltNorth = () => this.tilt(false, false);
    tiltSouth = () => this.tilt(false, true)
    tiltWest = () => this.tilt(true, false);
    tiltEast = () => this.tilt(true, true);
    tiltCycle = () => this.tiltNorth().tiltWest().tiltSouth().tiltEast();
}

exports.part1 = input => new Panel(parse(input)).tiltNorth().value();

exports.part2 = input => {
    const panel = new Panel(parse(input));

    let workKey = panel.key();
    let i = 1000000000;
    const stat = {[workKey]: i};
    while (--i >= 0) {
        panel.tiltCycle();
        workKey = panel.key();
        if (stat[workKey] !== undefined) {
            i = i % (stat[workKey] - i);
        } else {
            stat[workKey] = i;
        }
    }
    return panel.value();
};