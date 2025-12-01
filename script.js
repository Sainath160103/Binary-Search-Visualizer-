document.addEventListener("DOMContentLoaded", () => {

    const arrayInput = document.getElementById("arrayInput");
    const targetInput = document.getElementById("targetInput");
    const startButton = document.getElementById("startButton");
    const resetButton = document.getElementById("resetButton");
    const arrayContainer = document.getElementById("arrayContainer");
    const explanationText = document.getElementById("explanationText");
    const treeDisplay = document.getElementById("treeDisplay");
    const speedSlider = document.getElementById("speedSlider");
    const speedValue = document.getElementById("speedValue");

    let speed = parseInt(speedSlider.value);

    speedSlider.addEventListener("input", () => {
        speed = parseInt(speedSlider.value);
        speedValue.textContent = speed + "ms";
    });

    function buildArray() {
        const arr = arrayInput.value.split(",").map(n => parseInt(n.trim()));
        return arr.filter(n => !isNaN(n));
    }

    function renderArray(arr) {
        arrayContainer.innerHTML = "";
        const max = Math.max(...arr);

        arr.forEach((num, index) => {
            const elem = document.createElement("div");
            elem.classList.add("array-element");

            let height = (num / max) * 180 + 20;

            elem.innerHTML = `
                <div class="array-bar" style="height:${height}px"></div>
                <div>${num}</div>
                <span style="font-size:12px;color:#ccc">idx:${index}</span>
            `;

            elem.dataset.index = index;
            arrayContainer.appendChild(elem);
        });
    }

    function highlight(index, className) {
        const elem = arrayContainer.querySelector(`[data-index="${index}"] .array-bar`);
        if (elem) elem.classList.add(className);
    }
    function removeHighlight(index, className) {
        const elem = arrayContainer.querySelector(`[data-index="${index}"] .array-bar`);
        if (elem) elem.classList.remove(className);
    }

    async function sleep(ms) {
        return new Promise(res => setTimeout(res, ms));
    }

    async function startSearch() {
        let arr = buildArray();
        let target = parseInt(targetInput.value);

        if (arr.length === 0 || isNaN(target)) {
            alert("Invalid input!");
            return;
        }

        explanationText.textContent = "Binary Search Started...";
        renderArray(arr);

        let low = 0, high = arr.length - 1;

        while (low <= high) {
            let mid = Math.floor((low + high) / 2);

            highlight(low, "low");
            highlight(high, "high");
            highlight(mid, "mid");

            explanationText.textContent = `Checking middle value: ${arr[mid]}`;

            await sleep(speed);

            if (arr[mid] === target) {
                highlight(mid, "found");
                explanationText.textContent = `🎉 Found ${target} at index ${mid}`;
                return;
            }

            removeHighlight(low, "low");
            removeHighlight(high, "high");
            removeHighlight(mid, "mid");

            if (arr[mid] < target) {
                low = mid + 1;
                explanationText.textContent = `${arr[mid]} < ${target}, searching right half`;
            } else {
                high = mid - 1;
                explanationText.textContent = `${arr[mid]} > ${target}, searching left half`;
            }

            await sleep(speed);
        }

        explanationText.textContent = "❌ Target not found in the array.";
    }

    resetButton.addEventListener("click", () => {
        renderArray(buildArray());
        explanationText.textContent = "Reset complete.";
    });

    startButton.addEventListener("click", startSearch);

    renderArray(buildArray());
});
