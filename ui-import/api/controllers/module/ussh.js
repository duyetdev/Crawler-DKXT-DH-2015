var Student = require("../../../../model");

module.exports = function(req, res) {
		var sheet_url = 'https://docs.google.com/spreadsheets/d/1yUEekt_r5Kh9tnhF56jJYcCN--o6mEXXyPt9CPNSuB4/edit#gid=680423005';
		console.log("Update sheet data at ", sheet_url);
		
		if (!req.body.school_id) {
			return res.send("Error! Missing school data info.");	
		}
		
		var GoogleSpreadsheet = require("google-spreadsheet");
		 
		// spreadsheet key is the long id in the sheets URL 
		console.log("Reading spreadsheet id ", req.body.googlespreadsheet);
		var my_sheet = new GoogleSpreadsheet(req.body.googlespreadsheet);
		
		var count = 0;
		var creds = require('../../../../DuyetDev-a6965be6b9c8.json');
		
		my_sheet.useServiceAccountAuth(creds, function(err){
			my_sheet.getInfo( function( err, sheet_info ){
				if (err) console.log(err);
				
				else {
					var sheetId = [1,27];
					var getFaculty = function(sheet_id) {
						for (var i in sheetId) {
							if (sheetId[i].id == sheet_id) return sheetId[i].faculty;
						}
						
						return "";
					}
					var getSubjectGroup = function(subject) {
						subject = subject.replace("Ngữ văn", "Văn");
						subject = subject.replace("Tiếng ", "");
						subject = subject.replace("Lịch sử", "Sử");
						subject = subject.replace("Địa lí", "Địa"); 
						subject = subject.replace("Vật lí", "Lý");
						subject = subject.replace("Hóa học", "Hóa"); 
						
						subject = subject.replace(/,/g, "-");
						subject = subject.replace(/\s/g, "");
						
						return subject;
					}
					
					for (var i = 0; i < 27; i++) {
						var sheet = sheet_info.worksheets[i];
						//console.log(sheet);
						if (sheet) {
							sheet.getRows( function( err, rows ){ 
					            if (rows) {
									rows.forEach(function(row) {
										//console.log(row);
										var student = {
						                      student_name: row["họtên"],
						                      student_id: row["sbd"],
						                      school_code: "QSX", // Ma~ truo`ng
						                      faculty_code: row["ngànhnv1"], // Nga`nh
											  faculty: row["ngànhnv1"], // Nga`nh 
						                      subject_group: getSubjectGroup(row["tổhợpmônxét"]),
						                      priority: 1, // parseInt(row["điểmưutiênkv"].replace(",", ".")), // So thu tu nguyen vong uu tien
						                      score_1 : 0,
						                      score_2 : 0,
						                      score_3 : 0,
						                      score_priority: parseFloat(row["điểmưutiênkv"].replace(",", ".")),
						                      score_sum : parseFloat(row["điểmtổng"].replace(",", "."))
						                  };
										  // console.log(student);
										  
										  if (student.score_sum > 0) {
											  var saver = new Student(student);
												saver.save(function (err, data) {
													if (err) console.log('Error ', err.message);
													else console.log('Saved ['+ count++ +'] ', data.student_id);
												});
										  }
									})
								}
					        });	
						}
				        
					}
					res.send("Import ...");
				}
				
			});
		});
	}