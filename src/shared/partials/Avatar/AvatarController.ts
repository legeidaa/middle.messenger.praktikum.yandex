import { store } from '@shared/Store';

class AvatarController {
    public avatarBaseSrc: string = 'https://ya-praktikum.tech/api/v2/resources'

    public getAvatarSrc(path: string | null | undefined): string {
        if (!path) {
            return ''
        }
        return this.avatarBaseSrc + path
    }

    public getUserAvatarSrc(): string {
        if (store.getState().user?.avatar) {
            return this.avatarBaseSrc + (store.getState().user?.avatar ?? '') as string
        }
        return '/assets/images/avatar-skeleton.svg'
    }
}

export const avatarController = new AvatarController()
