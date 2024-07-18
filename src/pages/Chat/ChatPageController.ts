import { userAPI } from "@shared/api/UserApi";
import { store } from "@shared/Store";
import { addChatForm, addChatModal } from "@widgets/AddChatModal";
import { chatAPI } from "@shared/api/ChatApi";
import { ApiError } from "@shared/api/model";
import { User } from "@entities/User";
import { DialogItem } from "@widgets/DialogItem";
import { Avatar } from "@shared/partials";
import { avatarController } from "@shared/partials/Avatar";
import { getMessageTime } from "@shared/utils/getMessageTime";
import { state } from "@shared/Store/state";
import { chatMessages, chatPage, footerForm, footerSentBtn, footerTextarea } from "./ChatPage";
import { addUserForm, addUserModal } from "@widgets/AddUserModal";
import { authAPI } from "@shared/api/AuthApi";
import { chatController } from "@entities/Chat";
import { validateMessage } from "./validation";

export type ChatInfo = {
    id: number
}
class ChatPageController {
    public async getInitialData() {
        const userData = await authAPI.getUser()
        store.dispatch({ type: 'SET_USER', user: userData })
        chatController.getChats()
    }

    public async addChat(e: Event) {
        e.preventDefault()
        const input = addChatForm.children.input.children.input
        const fileInput = addChatForm.children.fileInput.children.input.getContent() as HTMLInputElement
        addChatModal.setProps({ modalTitleError: false, modalTitle: "Добавить чат" })

        try {

            const chatInfo = await chatAPI.addChat(input.props.value as string) as unknown as ChatInfo // возвращает   {"id": 16399}

            const formData = new FormData()
            let chatAvatar
            if (fileInput.files) {
                if (fileInput.files.length) {
                    formData.append('avatar', fileInput.files[0])
                    formData.append('chatId', String(chatInfo.id))

                    chatAvatar = await chatAPI.addChatAvatar(formData)
                    fileInput.value = ''
                }
            }
            console.log(
                "Данные чата и юзера: ",
                chatInfo,
                chatAvatar
            );

            addChatModal.setProps({ modalTitle: "Чат добавлен" })
            input.props.value = ''

            chatController.getChats()

            chatPageController.createDialogsList().then((dialogsList) => {
                chatPage.setProps({ dialogListItems: dialogsList })
            })

            return true

        } catch (err) {
            const error = err as ApiError

            if (err instanceof Error) {
                addChatModal.setProps({ modalTitleError: true, modalTitle: err.message })
                return err.message
            }
            addChatModal.setProps({ modalTitleError: true, modalTitle: error.reason })
            return error.reason
        }
    }

    public async deleteChat(e: Event) {
        e.preventDefault()

        const currentChat = store.getState().currentChat

        if (!currentChat) {
            return
        }

        try {
            const deletedChatInfo = await chatAPI.deleteChat(currentChat?.id)

            chatController.getChats()
            chatPageController.createDialogsList().then((dialogsList) => {
                chatPage.setProps({ dialogListItems: dialogsList })
            })

            store.dispatch({ type: 'SET_CURRENT_CHAT', currentChat: null })
            chatPage.setProps({ dialogListItems: chatPageController.createDialogsList() })
            chatPage.setProps({ chatPlaceholder: true, })

            return deletedChatInfo
        } catch (err) {
            const error = err as ApiError
            return error.reason
        }
    }

    public async addUserToChat(e: Event) {
        e.preventDefault()
        addUserModal.setProps({ modalTitleError: false, modalTitle: "Добавить пользователя" })

        const input = addUserForm.children.input.children.input
        const currentChat = store.getState().currentChat

        if (currentChat) {
            try {

                const currentChatUsers = await chatAPI.getChatUsers(currentChat?.id) as unknown as Partial<User>[]

                console.log("currentChatUsers", currentChatUsers);

                if (currentChatUsers?.length) {
                    const user = currentChatUsers.filter(u => u.login === input.props.value)[0]
                    if (user) {
                        throw new Error('Пользователь уже есть в чате')
                    }
                }

                const users = await userAPI.searchUser(input.props.value as string) as unknown as User[] // возвращает массив совпадений по юзерам
                if (!users.length) {
                    throw new Error('Пользователь не найден')
                }
                const user = users.filter(u => u.login === input.props.value)[0]
                await chatAPI.addUser(currentChat.id, user.id as number)
                addUserModal.setProps({ modalTitle: "Пользователь добавлен" })

                const newChatUsers = await chatAPI.getChatUsers(currentChat?.id) as unknown as Partial<User>[]
                console.log("newChatUsers", newChatUsers);

                return true

            } catch (err) {
                const error = err as ApiError

                if (err instanceof Error) {
                    addUserModal.setProps({ modalTitleError: true, modalTitle: err.message })
                    return err.message
                }
                addUserModal.setProps({ modalTitleError: true, modalTitle: error.reason })
                return error.reason
            }
        }
        return false
    }

    public openDialog(dialogListItems: DialogItem[], dialogItem: DialogItem) {

        // начинаем грузить сообщения 

        const currentChat = store.getState().currentChat
        console.log(currentChat);
        if (currentChat) {
            const connection = chatController.getConnectionById(currentChat.id)
            footerForm.props.events = {
                submit: (e: Event) => {
                    validateMessage(e)
                    console.log(footerTextarea.props.value)


                    const data = new FormData(e.target as HTMLFormElement)
                    const formDataObj = Object.fromEntries(data.entries())
                    console.log(formDataObj)

                    connection?.send({
                        content: formDataObj.message,
                        type: 'message',
                    })

                    footerTextarea.props.value = ''
                    // TODO при открытии чата сбрасывать unread_message_count
                    // TODO исправить вывод времени
                },
            }

        }

        chatMessages.children.headerAvatar.setProps({
            src: avatarController.getAvatarSrc(currentChat?.avatar),
        })
        chatMessages.setProps({
            headerName: currentChat?.title
        })
        // TODO возможно стоит заменить на смену attr
        dialogListItems.forEach((dialogItem) => { dialogItem.setProps({ selected: false }) })
        dialogItem.setProps({ selected: true })
    }

    public async createDialogsList() {
        let dialogListItems: DialogItem[] = []


        const user = store.getState().user
        const dialogs = store.getState().chats

        if (user && dialogs) {
            await chatController.createMessagesConnections(user, dialogs)
            console.log("createMessagesConnections", chatController.WSConnections, chatController.WSConnections.length)

            dialogs.map((chat) => {

                let avatarSrc = avatarController.getAvatarSrc(chat.avatar)

                let dialogName = chat.title
                let lastMessage = ''
                let lastMessageTime = ''
                let messageName = ''

                if (chat.last_message) {
                    lastMessage = chat.last_message.content
                    lastMessageTime = getMessageTime(chat.last_message.time)

                    messageName = chat.last_message.user.display_name
                        ? chat.last_message.user.display_name + ': '
                        : chat.last_message.user.first_name + ': '
                }

                const dialogItem = new DialogItem({
                    avatar: new Avatar({
                        src: avatarSrc
                    }),
                    name: dialogName,
                    message: lastMessage,
                    time: lastMessageTime,
                    count: chat.unread_count,
                    messageName,
                    selected: false,
                    events: {
                        click: (e) => {
                            e.preventDefault()
                            if (!dialogItem.props.selected) {
                                store.dispatch({ type: 'SET_CURRENT_CHAT', currentChat: chat })
                                this.openDialog(dialogListItems, dialogItem)
                            }
                        }
                    }
                })

                chatController.updateDialogsListItem(chat, dialogItem)
                dialogListItems.push(dialogItem)
            })
            return dialogListItems
        }
        return new Error('Не удалось создать список диалогов')
    }
}

export const chatPageController = new ChatPageController()