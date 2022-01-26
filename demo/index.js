import IconSelect from '../'
//
import i0 from './icons/0.png'
import i1 from './icons/1.png'
import i2 from './icons/2.png'
import i3 from './icons/3.png'
import i4 from './icons/4.png'
import i5 from './icons/5.png'
import i6 from './icons/6.png'
import i7 from './icons/7.png'
import i8 from './icons/8.png'
import i9 from './icons/9.png'

const element = document.createElement('div')
element.style.position = 'absolute'
element.style.top = '50%'
element.style.right = '50%'
element.style.transform = 'translate(-50%, -50%)'
document.body.appendChild(element)
const iconSelect = new IconSelect(null, element, {
	revertHorizontalAxis: true,
	revertVerticalAxis: true,
})
iconSelect.refresh([
	{ iconFilePath: i0, iconValue: 0 },
	{ iconFilePath: i1, iconValue: 1 },
	{ iconFilePath: i2, iconValue: 2 },
	{ iconFilePath: i3, iconValue: 3 },
	{ iconFilePath: i4, iconValue: 4 },
	{ iconFilePath: i5, iconValue: 5 },
	{ iconFilePath: i6, iconValue: 6 },
	{ iconFilePath: i7, iconValue: 7 },
	{ iconFilePath: i8, iconValue: 8 },
	{ iconFilePath: i9, iconValue: 9 },
])
