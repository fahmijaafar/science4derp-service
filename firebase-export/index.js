// Import required Firebase modules correctly
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');
const ExcelJS = require('exceljs');

// Firebase configuration
const firebaseConfig = {
  //config
};

async function exportToExcel() {
  try {
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    console.log('Starting export process...');
    
    // Create Excel workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('borangKesengsaraan');

    // Set column headers
    worksheet.columns = [
      { header: 'Name', key: 'name', width: 20 },
      { header: 'Email', key: 'email', width: 25 },
      { header: 'Phone', key: 'phone', width: 15 },
      { header: 'Comment', key: 'comment', width: 40 },
      { header: 'Time', key: 'time', width: 20 },
      { header: 'Created', key: 'created', width: 20 }
    ];

    // Get documents from Firestore
    const querySnapshot = await getDocs(collection(db, 'borangKesengsaraan'));

    if (querySnapshot.empty) {
      console.log('No documents found.');
      return;
    }

    console.log(`Found ${querySnapshot.size} documents...`);

    // Add rows to Excel
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      worksheet.addRow({
        name: data.name || 'N/A',
        email: data.email || 'N/A',
        phone: data.phone || 'N/A',
        comment: data.comment || 'N/A',
        time: data.time || 'N/A'
      });
    });

    // Save file
    await workbook.xlsx.writeFile('db.xlsx');
    console.log('Successfully exported to db.xlsx');

  } catch (error) {
    console.error('Export failed:', error);
    process.exit(1);
  }
}

exportToExcel();
