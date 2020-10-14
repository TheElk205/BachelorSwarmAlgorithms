const Checkbox = (id, onChange = null, isChecked = false) => {
    const checkbox = document.getElementById(id)
    checkbox.checked = isChecked
    if (onChange !== null) {
        checkbox.onchange = onChange
    }
}

export default Checkbox
