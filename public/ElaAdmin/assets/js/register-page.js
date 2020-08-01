const studentFieldsMarkup = `
<div class="form-group">
<label for="college" class=" form-control-label">College</label>
<select name="college" id="college" class="form-control">
    <option value="">Please select</option>
    <option value="NIT Trichy">NIT Trichy</option>
    <option value="NIT Rourkela">NIT Rourkela</option>
    <option value="NIT Warangal">NIT Warangal</option>
</select>
</div>
<div class="form-group">
<label>Branch</label>
<input type="text" class="form-control" placeholder="Branch" name="branch">
</div>
<div class="form-group">
<label>Year of study</label>
<input type="number" class="form-control" placeholder="Year" name="year" max="5">
</div>
<div class="row form-group">
<div class="col col-md-12"><label for="file-input" class=" form-control-label">Upload Resume</label></div>
<div class="col-12 col-md-12"><input type="file" id="file-input" name="file" class="form-control-file"></div>
</div>
`;

const studentCheckboxHandler = (e) => {
    console.log(e.target)
    if (e.target.checked) {
        document.querySelector("#studentFields").innerHTML = studentFieldsMarkup;
    } else {
        document.querySelector("#studentFields").innerHTML = '';
    }
}

document.querySelector("#isStudent").addEventListener('change', studentCheckboxHandler);