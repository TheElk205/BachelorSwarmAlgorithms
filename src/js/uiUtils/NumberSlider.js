const NumberSlider = (id, onChange = null) => {
    const slider = document.getElementById(id)
    slider.oninput = (input) => {
        if (onChange !== null)
        {
            onChange(parseFloat(input.target.value))
        }
    }

    return {
        getValue: () => {
            return parseFloat(slider.value)
        }
    }
}

export default NumberSlider