import Trash from '../../assets/icons/trash.svg?react'
import Plus from '../../assets/icons/plus.svg?react'

const icons = {
    trash: Trash,
    plus: Plus
}

interface IIcons {
    iconName: keyof typeof icons,
    styles?: string
}

const Icons = ({ iconName, styles }: IIcons) => {
    const Icon = icons[iconName] as React.FunctionComponent<React.SVGProps<SVGSVGElement>>
    return <Icon className={styles} />

}

export default Icons;