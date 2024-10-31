import Trash from '../../assets/icons/trash.svg?react'
import Plus from '../../assets/icons/plus.svg?react'

const icons = {
    trash: Trash,
    plus: Plus
}

interface IIcons {
    iconName: keyof typeof icons
}

const Icons = ({ iconName }: IIcons) => {
    const Icon = icons[iconName] as React.FunctionComponent<React.SVGProps<SVGSVGElement>>
    return <Icon />
}

export default Icons;