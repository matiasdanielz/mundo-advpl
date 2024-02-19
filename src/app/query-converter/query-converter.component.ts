import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-query-converter',
  templateUrl: './query-converter.component.html',
  styleUrls: ['./query-converter.component.css']
})
export class QueryConverterComponent implements OnInit{
  @ViewChild('queryTypeSelect', {static: true}) queryTypeSelect: any;

  public queryRequest: String = '';
  public queryResponse: String = '';

  public windowHeight: string = (window.innerHeight - window.innerHeight / 2.5).toString();

  readonly queryOptions = [
    { label: 'Tcquery', value: 1 },
    { label: 'BeginSql', value: 2 }
  ];

  constructor() {}

  ngOnInit(): void {
    this.queryTypeSelect.selectedValue = 1;
    this.queryTypeSelect.displayValue = "Tcquery";
  }

  public convertSqlToTcQuery(): string {
    const formattedSql = this.queryRequest.replace(/\r/g, '').trim();
    const keywords = ['SELECT', 'FROM', 'WHERE', 'CASE', 'ORDER BY', 'GROUP BY', 'HAVING', 'INSERT INTO', 'UPDATE', 'DELETE', 'INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'FULL OUTER JOIN', 'DISTINCT', 'COUNT', 'SUM', 'AVG', 'BETWEEN', 'LIKE', 'EXISTS', 'LIMIT', 'CASE'];
    const lines = formattedSql.split('\n');
    
    let tcQuery = '';
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim().toUpperCase();
      let currentPosition = 0;
      
      if (line.length > 0) {
        while (currentPosition < line.length) {
          let foundKeyword = false;
          for (const keyword of keywords) {
            if (line.indexOf(keyword, currentPosition) === currentPosition) {
              if (tcQuery.length > 0) {
                tcQuery += ' "\n';
              }
              tcQuery += 'cQuery += " ' + keyword + ' ';
              currentPosition += keyword.length;
              foundKeyword = true;
              break;
            }
          }
    
          if (!foundKeyword) {
            tcQuery += line[currentPosition];
            currentPosition++;
          }
        }
      } else if (i < lines.length - 1) {
        // Adicione uma quebra de linha se a linha estiver vazia e a próxima linha começar com uma palavra-chave
        const nextLine = lines[i + 1].trim().toUpperCase();
        if (keywords.some(keyword => nextLine.startsWith(keyword))) {
          tcQuery += '\n';
        }
      }
      
      if (i < lines.length - 1) {
        tcQuery += ' "\n'; // Adicione as aspas e uma quebra de linha após cada quebra de linha na query original
        tcQuery += 'cQuery += " ';
      }
    }
    
    if (tcQuery.trim() === '') {
      // Se não houver nenhuma quebra de linha, adicione uma quebra de linha após cada ponto-e-vírgula
      tcQuery = formattedSql.replace(/;/g, ';\n') + '\n';
    }
    
    this.queryResponse = tcQuery.replace('\ncQuery += "  "', '');
    
    return tcQuery;
  }

  public convertSqlToBeginSql(): string {
    const formattedSql = this.queryRequest.replace(/\n/g, ' ').trim().toUpperCase();
    const lines = formattedSql.split(/\s+(?=FROM|WHERE|GROUP BY|HAVING|ORDER BY|INNER JOINN|RIGHT JOIN|LEFT JOIN|JOIN|CASE|THEN|WHEN|AND)/i);
  
    let beginSql = 'BEGINSQL Alias "yourAliasHere"\n';
  
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
  
      if (line.startsWith("SELECT ")) {
        const selectFields = line.substring(7).split(",");
        const lastField = selectFields[selectFields.length - 1].trim();
  
        beginSql += "    SELECT\n";
        for (let j = 0; j < selectFields.length; j++) {
          const field = selectFields[j].trim();
          beginSql += "      " + field + (field !== lastField ? "," : "") + "\n";
        }
      } else if (line.startsWith("FROM ")) {
        const fromClause = line.substring(5);
        beginSql += "    FROM\n";
        beginSql += "      " + fromClause + "\n";
      }else if (line.startsWith("LEFT")) {
        beginSql += "      " + line + "\n";
      }
       else if (line.startsWith("JOIN")) {
        beginSql += "      " + line + "\n";
      } else if (line.startsWith("WHERE")) {
        beginSql += "    WHERE\n";
        beginSql += "      " + line.substring(6) + "\n";
      } else if (line.startsWith("GROUP BY")) {
        beginSql += "    GROUP BY\n";
        beginSql += "      " + line.substring(9) + "\n";
      } else if (line.startsWith("HAVING")) {
        beginSql += "    HAVING\n";
        beginSql += "      " + line.substring(7) + "\n";
      } else if (line.startsWith("ORDER BY")) {
        beginSql += "    ORDER BY\n";
        beginSql += "      " + line.substring(9) + "\n";
      }else if (line.startsWith("CASE")) {
        beginSql += "    CASE";
        beginSql += "      " + line.substring(5) + "\n";
      }else if (line.startsWith("THEN")) {
        beginSql += "    THEN";
        beginSql += "      " + line.substring(5) + "\n";
      }else if (line.startsWith("WHEN")) {
        beginSql += "    WHEN\n";
        beginSql += "      " + line.substring(5) + "\n";
      }else if (line.startsWith("AND")) {
        beginSql += "    AND\n";
        beginSql += "      " + line.substring(4) + "\n";
      }
    }
  
    beginSql += "ENDSQL";
  
    this.queryResponse = beginSql;
  
    return beginSql;
  }

}
