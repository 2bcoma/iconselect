import icon from './arrow.png'
import './iconselect.css'

export default class IconSelect {
	_icons = []
	_selectedIndex = -1
	_view = new View()

	constructor(elementID, element, parameters = {}) {
		if (!this._view.setIconSelectElement(element))
			throw `element {elementID} is not found`

		this._params = Model.checkParameters(parameters)
		this._view.createUI(this._params, elementID)
		this._view.iconSelectElement.onclick = () => this._view.showBox()
		this._view.showBox(false)
		this._view.iconSelectElement.addEventListener('click', (ev) =>
			ev.stopPropagation(),
		)
		window.addEventListener('click', () => this._view.showBox(false))
	}

	refresh(icons) {
		this._icons = []
		this._view.clearIcons()
		for (let i = 0; i < icons.length; i++) {
			const icon = icons[i]
			icon.element = this._view.createIcon(
				icon.iconFilePath,
				icon.iconValue,
				i,
				this._params,
			)
			icon.element.onclick = () => {
				this.setSelectedIndex(
					icon.element.childNodes[0].getAttribute('icon-index'),
				)
			}
			this._icons.push(icon)
		}

		const horizontalIconNumber = Math.ceil(
			icons.length / this._params.vectoralIconNumber,
		)
		this._view.boxElement.style.height =
			(this._params.iconsHeight + 2) * horizontalIconNumber +
			(horizontalIconNumber + 1) * this._params.boxIconSpace +
			'px'
		this.setSelectedIndex(0)
	}

	getIcons() {
		return this._icons
	}

	setSelectedIndex(index) {
		let icon = null
		if (this._icons.length > index) icon = this._icons[index]
		if (icon) {
			if (this._selectedIndex != -1)
				this._icons[this._selectedIndex].element.setAttribute('class', 'icon')
			this._selectedIndex = index
			this._view.selectedIconImgElement.setAttribute('src', icon.iconFilePath)
			if (this._selectedIndex != -1)
				this._icons[this._selectedIndex].element.setAttribute(
					'class',
					'icon selected',
				)
		}
		this._view.iconSelectElement.dispatchEvent(new CustomEvent('changed'))
	}

	setSelectedValue(value) {
		const icons = this._icons.filter((e) => e.iconValue == value)
		const index = icons.length > 0 ? this._icons.indexOf(icon[0]) : -1
		return this.setSelectedIndex(index)
	}

	getSelectedIndex() {
		return this._selectedIndex
	}

	getSelectedValue() {
		return this._icons[this._selectedIndex].iconValue
	}

	getSelectedFilePath() {
		return this._icons[this._selectedIndex].iconFilePath
	}
}

class View {
	iconSelectElement
	boxElement
	boxScrollElement
	selectedIconImgElement
	selectedIconElement

	showBox(isShown) {
		if (isShown == null) {
			isShown = this.boxElement.style.display == 'none' ? true : false
		}

		if (isShown) {
			this.boxElement.style.display = 'block'
			this.boxScrollElement.style.display = 'block'
		} else {
			this.boxElement.style.display = 'none'
			this.boxScrollElement.style.display = 'none'
		}

		this.boxElement.style.display = isShown ? 'block' : 'none'
	}

	setIconSelectElement(element) {
		this.iconSelectElement = element
		return this.iconSelectElement
	}

	clearUI() {
		this.iconSelectElement.innerHTML = ''
	}

	clearIcons() {
		this.boxElement.innerHTML = ''
	}

	createUI(parameters, elementID) {
		this.clearUI()

		this.iconSelectElement.setAttribute('class', 'icon-select')

		let selectedBoxElement = document.createElement('div')
		selectedBoxElement.setAttribute('class', 'selected-box')

		let selectedIconElement = document.createElement('div')
		selectedIconElement.setAttribute('class', 'selected-icon')

		this.selectedIconImgElement = document.createElement('img')
		this.selectedIconImgElement.setAttribute('src', '')
		selectedIconElement.appendChild(this.selectedIconImgElement)

		let componentIconElement = document.createElement('div')
		componentIconElement.setAttribute('class', 'component-icon')

		let componentIconImgElement = document.createElement('img')
		componentIconImgElement.setAttribute('src', icon)
		componentIconElement.appendChild(componentIconImgElement)

		this.boxScrollElement = document.createElement('div')
		this.boxScrollElement.setAttribute('id', elementID + '-box-scroll')
		this.boxScrollElement.setAttribute('class', 'box')

		this.boxElement = document.createElement('div')

		this.boxScrollElement.appendChild(this.boxElement)

		this.selectedIconImgElement.setAttribute(
			'width',
			parameters.selectedIconWidth,
		)
		this.selectedIconImgElement.setAttribute(
			'height',
			parameters.selectedIconHeight,
		)
		selectedBoxElement.style.width =
			parameters.selectedIconWidth +
			parameters.selectedBoxPadding +
			parameters.selectedBoxPaddingRight +
			'px'
		selectedBoxElement.style.height =
			parameters.selectedIconHeight + parameters.selectedBoxPadding * 2 + 'px'
		selectedIconElement.style.width = parameters.selectedIconWidth + 'px'
		selectedIconElement.style.height = parameters.selectedIconHeight + 'px'
		selectedIconElement.style.top = '0px'
		selectedIconElement.style.left = '0px'
		componentIconElement.style.bottom = 4 + parameters.selectedBoxPadding + 'px'

		this.boxScrollElement.style.width =
			(parameters.iconsWidth + 6) * parameters.vectoralIconNumber +
			(parameters.vectoralIconNumber + 1) * parameters.boxIconSpace +
			'px'
		this.boxScrollElement.style.height =
			(parameters.iconsHeight + 2) * parameters.horizontalIconNumber +
			(parameters.horizontalIconNumber + 1) * parameters.boxIconSpace +
			'px'

		let leftOffset = parseInt(selectedBoxElement.style.width) + 1
		if (parameters.revertHorizontalAxis) {
			leftOffset = -1 * parseInt(this.boxScrollElement.style.width) - 3
		}
		this.boxScrollElement.style.left = leftOffset + 'px'

		if (parameters.revertVerticalAxis) {
			const topOffset =
				-1 * parseInt(this.boxScrollElement.style.height) +
				parseInt(selectedBoxElement.style.height) -
				1
			this.boxScrollElement.style.top = topOffset + 'px'
		}

		this.boxElement.style.left = this.boxScrollElement.style.left + 'px'
		this.boxElement.style.width = this.boxScrollElement.style.width + 'px'

		this.iconSelectElement.appendChild(selectedBoxElement)
		selectedBoxElement.appendChild(selectedIconElement)
		selectedBoxElement.appendChild(componentIconElement)
		selectedBoxElement.appendChild(this.boxScrollElement)

		let results = {}
		results['iconSelectElement'] = this.iconSelectElement
		results['selectedBoxElement'] = selectedBoxElement
		results['selectedIconElement'] = selectedIconElement
		results['selectedIconImgElement'] = this.selectedIconImgElement
		results['componentIconElement'] = componentIconElement
		results['componentIconImgElement'] = componentIconImgElement

		return results
	}

	createIcon(iconFilePath, iconValue, index, parameters) {
		let iconElement = document.createElement('div')
		iconElement.setAttribute('class', 'icon')
		iconElement.style.width = parameters.iconsWidth + 'px'
		iconElement.style.height = parameters.iconsHeight + 'px'
		iconElement.style.marginLeft = parameters.boxIconSpace + 'px'
		iconElement.style.marginTop = parameters.boxIconSpace + 'px'

		let iconImgElement = document.createElement('img')
		iconImgElement.setAttribute('src', iconFilePath)
		iconImgElement.setAttribute('alt', iconValue)
		iconImgElement.setAttribute('title', iconValue)
		iconImgElement.setAttribute('icon-value', iconValue)
		iconImgElement.setAttribute('icon-index', index)
		iconImgElement.setAttribute('width', parameters.iconsWidth)
		iconImgElement.setAttribute('height', parameters.iconsHeight)
		iconImgElement.style.width = parameters.iconsWidth + 'px'
		iconImgElement.style.height = parameters.iconsHeight + 'px'

		iconElement.appendChild(iconImgElement)
		this.boxElement.appendChild(iconElement)

		return iconElement
	}
}

class Model {
	static _default = {
		SELECTED_ICON_WIDTH: 48,
		SELECTED_ICON_HEIGHT: 48,
		SELECTED_BOX_PADDING: 1,
		SELECTED_BOX_PADDING_RIGHT: 12,
		ICONS_WIDTH: 32,
		ICONS_HEIGHT: 32,
		BOX_ICON_SPACE: 1,
		HORIZONTAL_ICON_NUMBER: 3,
		VECTORAL_ICON_NUMBER: 3,
		REVERT_HORIZONTAL_AXIS: false,
		REVERT_VERTICAL_AXIS: false,
	}
	static checkParameters(parameters) {
		parameters.selectedIconWidth = parameters.selectedIconWidth
			? parameters.selectedIconWidth
			: Model._default.SELECTED_ICON_WIDTH
		parameters.selectedIconHeight = parameters.selectedIconHeight
			? parameters.selectedIconHeight
			: Model._default.SELECTED_ICON_HEIGHT
		parameters.selectedBoxPadding = parameters.selectedBoxPadding
			? parameters.selectedBoxPadding
			: Model._default.SELECTED_BOX_PADDING
		parameters.selectedBoxPaddingRight = parameters.selectedBoxPaddingRight
			? parameters.selectedBoxPaddingRight
			: Model._default.SELECTED_BOX_PADDING_RIGHT
		parameters.iconsWidth = parameters.iconsWidth
			? parameters.iconsWidth
			: Model._default.ICONS_WIDTH
		parameters.iconsHeight = parameters.iconsHeight
			? parameters.iconsHeight
			: Model._default.ICONS_HEIGHT
		parameters.boxIconSpace = parameters.boxIconSpace
			? parameters.boxIconSpace
			: Model._default.BOX_ICON_SPACE
		parameters.vectoralIconNumber = parameters.vectoralIconNumber
			? parameters.vectoralIconNumber
			: Model._default.VECTORAL_ICON_NUMBER
		parameters.horizontalIconNumber = parameters.horizontalIconNumber
			? parameters.horizontalIconNumber
			: Model._default.HORIZONTAL_ICON_NUMBER
		parameters.revertHorizontalAxis = parameters.revertHorizontalAxis
			? parameters.revertHorizontalAxis
			: Model._default.REVERT_HORIZONTAL_AXIS
		parameters.revertVerticalAxis = parameters.revertVerticalAxis
			? parameters.revertVerticalAxis
			: Model._default.REVERT_VERTICAL_AXIS
		return parameters
	}
}

;(() => {
	if (typeof window.CustomEvent === 'function') return false
	function CustomEvent(event, params) {
		params = params || { bubbles: false, cancelable: false, detail: undefined }
		let evt = document.createEvent('CustomEvent')
		evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail)
		return evt
	}
	CustomEvent.prototype = window.Event.prototype
	window.CustomEvent = CustomEvent
})()