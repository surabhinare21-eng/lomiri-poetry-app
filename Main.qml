import QtQuick 2.4
import Ubuntu.Components 1.3
import "components"
import "db.js" as DB

MainView {
    applicationName: "poetry.surabhi"
    width: units.gu(45)
    height: units.gu(75)

    ListModel { id: poemModel }

    Component.onCompleted: {
        DB.init()
        loadPoems()
    }

    function loadPoems() {
        poemModel.clear()
        DB.getPoems(function(p){ poemModel.append(p) })
    }

    PageStack {
        id: stack
        anchors.fill: parent
        Component.onCompleted: stack.push(homePage)
    }

    Component {
        id: homePage
        Page {
            header: PageHeader {
                title: "🌸 Poetry Feed"
                trailingActionBar.actions: [
                    Action { iconName: "add"; onTriggered: stack.push(addPage) },
                    Action { iconName: "contact"; onTriggered: stack.push(profilePage) },
                    Action { iconName: "search"; onTriggered: stack.push(promptsPage) },
                    Action { iconName: "contact-group"; onTriggered: stack.push(friendsPage) }
                ]
            }

            Rectangle {
                anchors.fill: parent
                color: "#a8f0d1"

                Column {
                    width: parent.width
                    spacing: units.gu(1)

                    TextField {
                        id: search
                        width: parent.width
                        placeholderText: "Search poems..."
                    }

                    ListView {
                        width: parent.width
                        height: parent.height - search.height
                        model: poemModel

                        delegate: PoemDelegate {
                            visible: poemTitle.toLowerCase().includes(search.text.toLowerCase())
                            poemTitle: title
                            poemBody: body
                            author: author
                        }
                    }
                }
            }
        }
    }

    Component { id: addPage; AddPoem { onPoemAdded: loadPoems() } }
    Component { id: profilePage; Profile {} }
    Component { id: friendsPage; Friends {} }
    Component { id: promptsPage; Prompts {} }
}