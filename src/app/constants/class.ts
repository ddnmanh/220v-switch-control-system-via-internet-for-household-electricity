import colorGlobal from "./colors";

interface Style {
    backgroundColor?: string;
    color?: string;
    borderWidth?: number;
    borderColor?: string;
    padding?: number;
}

interface ButtonStyles {
    primary: Style[];
    cancel: Style[];
    danger: Style[];
    warning: Style[];
    success: Style[];
    link: Style[];
    nothing: Style[];
}

interface ClassGlobal {
    button: ButtonStyles;
}

const classGlobal: ClassGlobal = {
    button: {
        primary: [
            { backgroundColor: colorGlobal.btnPrimary },
            { color: 'white' }
        ],
        cancel: [
            { backgroundColor: 'transparent', borderWidth: 2, borderColor: colorGlobal.border },
            { color: colorGlobal.textSecondary }
        ],
        danger: [
            { backgroundColor: colorGlobal.danger },
            { color: 'white' }
        ],
        warning: [
            { backgroundColor: colorGlobal.warning },
            { color: 'white' }
        ],
        success: [
            { backgroundColor: colorGlobal.succes },
            { color: 'white' }
        ],
        link: [
            { backgroundColor: colorGlobal.btnLink },
            { color: colorGlobal.textLink }
        ],
        nothing: [
            { backgroundColor: 'transparent', borderWidth: 0, borderColor: 'transparent', padding: 0 },
            { color: 'black' }
        ]
    }
}

export default classGlobal;
