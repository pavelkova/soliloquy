import { User } from './user'

interface SharedTag {
    id: number
    name: string
    createdAt: Date
}

export interface DBTag extends SharedTag {
    userId: number
    parentId?: number
}

export interface Tag extends SharedTag {
    user: User
    parent?: Tag
    children?: [Tag]
}
