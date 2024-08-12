export const convertFileToArrayBuffer = (file) => {
	return new Promise((resolve, reject) => {
		const fileReader = new FileReader();

		fileReader.onload = function (e) {
			resolve(this.result);
		};
		fileReader.onerror = (err) => {
			reject(err);
		};

		fileReader.readAsArrayBuffer(file);
	});
};
