const createAutoComplete = ({
    root,
    renderOption,
    onOptionSelect,
    inputValue,
    fetchData
}) => {
    // the movie search
    root.innerHTML = `
        <label><b>Search</b></label>
        <input class="input" />
        <div class="dropdown">
            <div class="dropdown-menu">
                <div class="dropdown-content results"></div>
            <div>
        </div>
    `;

    const input = root.querySelector('input');
    const dropdown = root.querySelector('.dropdown');
    const resultsWrapper = root.querySelector('.results');


    //slecting the search input and applying it fetch data.
    const onInput = async event => {
        const items = await fetchData(event.target.value); //calling fecth data with the value of the input

        //hiding the dropdown if there is not search results
        if (!items.length) {
            dropdown.classList.remove('is-active');
            return;
        }

        resultsWrapper.innerHTML = '';
        dropdown.classList.add('is-active');
        for (let item of items) {
            const option = document.createElement('a');


            option.classList.add('dropdown-item');
            option.innerHTML = renderOption(item); // generating hmtl to show for this render option. 

            //handling when user click a movie the search bar inherits the name of movie cliked
            option.addEventListener('click', () => {
                dropdown.classList.remove('is-active');
                input.value = inputValue(item);
                onOptionSelect(item);
            });


            resultsWrapper.appendChild(option);
        }
    };
    input.addEventListener('input', debounce(onInput, 500)); //applying debounce func with delay of 500ms

    //handling the closing searched results after user clicks outside it.
    document.addEventListener('click', event => {
        if (!root.contains(event.target)) {
            dropdown.classList.remove('is-active'); //removing is active to hide the dropdown
        }
    });
}