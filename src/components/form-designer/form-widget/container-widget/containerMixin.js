import {deleteAllLinkWidgetCode} from "@/utils/linkWidgetUtils";

export default {
  inject: ['getFormConfig'],
  computed: {
    formConfig() {
      return this.getFormConfig()
    },

  },
  methods: {
    appendTableRow(widget) {
      this.designer.appendTableRow(widget)
    },

    appendTableCol(widget) {
      this.designer.appendTableCol(widget)
    },

    onContainerDragAdd(evt, subList) {
      const newIndex = evt.newIndex
      if (!!subList[newIndex]) {
        this.designer.setSelected(subList[newIndex])
      }

      this.designer.emitHistoryChange()
      this.designer.emitEvent('field-selected', this.widget)
    },

    onContainerDragUpdate() {
      this.designer.emitHistoryChange()
    },

    checkContainerMove(evt) {
      return this.designer.checkWidgetMove(evt)
    },

    selectWidget(widget) {
      this.designer.setSelected(widget)
    },

    selectParentWidget() {
      if (this.parentWidget) {
        this.designer.setSelected(this.parentWidget)
      } else {
        this.designer.clearSelected()
      }
    },

    moveUpWidget() {
      this.designer.moveUpWidget(this.parentList, this.indexOfParentList)
      this.designer.emitHistoryChange()
    },

    moveDownWidget() {
      this.designer.moveDownWidget(this.parentList, this.indexOfParentList)
      this.designer.emitHistoryChange()
    },

    cloneContainer(widget) {
      if (!!this.parentList) {
        let newCon = this.designer.cloneContainer(widget)
        if (newCon) {
          this.parentList.splice(this.indexOfParentList + 1, 0, newCon)
          this.designer.setSelected(newCon)
          this.designer.emitHistoryChange()
        }
      }
    },

    removeWidget() {
      if (!!this.parentList) {
        let nextSelected = null
        if (this.parentList.length === 1) {
          if (!!this.parentWidget) {
            nextSelected = this.parentWidget
          }
        } else if (this.parentList.length === (1 + this.indexOfParentList)) {
          nextSelected = this.parentList[this.indexOfParentList - 1]
        } else {
          nextSelected = this.parentList[this.indexOfParentList + 1]
        }

        this.$nextTick(() => {
          deleteAllLinkWidgetCode(this.parentList[0].widgetList, this.designer)
          this.parentList.splice(this.indexOfParentList, 1)
          //if (!!nextSelected) {
          this.designer.setSelected(nextSelected)
          //}

          this.designer.emitHistoryChange()
        })
      }
    },

    setWidgetOption(optionName, optionValue) { //通用组件选项修改API
      if (this.widget.options.hasOwnProperty(optionName)) {
        this.widget.options[optionName] = optionValue
      }
    },

  }
}
