import sqlite3


def colorPrint(message, color):
    print("\033[%sm%s\033[0m" % (color, message))

DB_NAME = "Birds"

conn = sqlite3.connect("{db_name}.sqlite3".format(db_name=DB_NAME.lower()))
c = conn.cursor()
c.execute("SELECT * FROM {db_name} ORDER BY id".format(db_name=DB_NAME))

for org in c.fetchall():
    if not org[3]:
        next_org = False
        description = ""
        colorPrint(org[1], "1;92")
        while not next_org:
            user_input = input("Description? ")

            if user_input != "":
                user_input = user_input.replace("'", "\'")
                description += "\\n" + user_input
            else:
                description = description[2:]
                command = "UPDATE {db_name} SET description = '{description}' WHERE ID = {id}".format(
                    db_name=DB_NAME,
                    description=description,
                    id=org[0]
                )
                colorPrint(command, "1;94")
                c.execute(command)
                conn.commit()
                next_org = True
